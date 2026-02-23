<script>
    import { onMount, onDestroy } from "svelte";
    import demoAudio from "$lib/assets/misc-audio-demo.mp3";
    const WORKGROUP_SIZE = 8;

    // Canvas dimensions
    const width = 540;
    const height = 360;
    const size = Math.max(width, height);

    // Julia set parameters
    let scale = 1.5;
    let offsetX = 0.0;
    let offsetY = 0.0;
    let exponent = 2.0;
    let juliaAngle = $state(2.2); // Angle around the circle for c value
    let baseRadius = 0.25; // Base radius for c value
    let audioRadius = 0.25; // Radius modified by audio
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastJuliaUpdate = 0;
    let frameCount = 0;
    let powerState = 0;
    let powerDeltaState = 0;
    let gainState = 0;
    let noiseState = 0.0;
    let lastTime = 0;
    let totalTime = 0;
    let audioFrame = 0;
    let sampleRate = 44100;

    let webgpuSupported = $state(true);
    let webgpuError = $state("");
    let audioContext;
    let analyser;
    let microphoneStream;
    let audioInitialized = false;
    let timeData;
    let frequencyData;
    let previousFrequencyData;
    let isListening = $state(false);
    let isPlaying = $state(false);
    let audioSource;
    let audioElement;

    const complexPowWgsl = `
        fn complex_pow(z_re: f32, z_im: f32, n: f32) -> vec2<f32> {
            // Handle integer powers more efficiently
            if (n == 2.0) {
                return vec2<f32>(
                    z_re * z_re - z_im * z_im,
                    2.0 * z_re * z_im
                );
            }
            
            // For non-integer powers, use polar form
            let r = sqrt(z_re * z_re + z_im * z_im);
            if (r == 0.0) {
                return vec2<f32>(0.0, 0.0);
            }
            let theta = atan2(z_im, z_re);
            let r_n = pow(r, n);
            let theta_n = n * theta;
            return vec2<f32>(
                r_n * cos(theta_n),
                r_n * sin(theta_n)
            );
        }
    `;

    const juliaWgsl = `
        @group(0) @binding(0) var output: texture_storage_2d<rgba8unorm, write>;

        struct Params {
            width: f32,
            height: f32,
            max_iterations: f32,
            scale: f32,
            offset_x: f32,
            offset_y: f32,
            power: f32,
            c_re: f32,
            c_im: f32,
        }
        @group(0) @binding(1) var<uniform> params: Params;

        ${complexPowWgsl}

        @compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
        fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
            let x = global_id.x;
            let y = global_id.y;
            let width = params.width;
            let height = params.height;
            let max_iterations = u32(params.max_iterations);
            
            if (x >= u32(width) || y >= u32(height)) {
                return;
            }

            let scale = params.scale;
            let offset_x = params.offset_x;
            let offset_y = params.offset_y;
            let size = max(width, height);

            // Map pixel coordinates to complex plane
            let c_re = params.c_re;
            let c_im = params.c_im;

            var z_re = (f32(x) - width / 2.0) * scale / size;
            var z_im = (f32(y) - height / 2.0) * scale / size;
            var i: u32 = 0u;

            // Iterate until escape or max iterations reached
            for (; i < max_iterations; i++) {
                let new_z = complex_pow(z_re, z_im, params.power);
                z_re = new_z.x + c_re;
                z_im = new_z.y + c_im;

                if (z_re * z_re + z_im * z_im > 4.0) {
                    break;
                }
            }

            // Color based on iteration count
            let t = f32(i) / f32(max_iterations);
            let color = vec4<f32>(
                0.5 + 0.5 * cos(3.0 + t * 3.0),
                0.5 + 0.5 * cos(3.0 + t * 4.0),
                0.5 + 0.5 * cos(3.0 + t * 5.0),
                1.0
            );

            textureStore(output, vec2<u32>(x, y), color);
        }
    `;

    const vertexWgsl = `
        struct VertexInput {
            @location(0) position: vec2<f32>,
        }

        @vertex
        fn main(input: VertexInput) -> @builtin(position) vec4<f32> {
            return vec4<f32>(input.position, 0.0, 1.0);
        }
    `;

    const fragmentWgsl = `
        @group(0) @binding(0) var tex: texture_2d<f32>;
        @group(0) @binding(1) var texSampler: sampler;

        @fragment
        fn main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
            return textureSample(tex, texSampler, pos.xy / vec2<f32>(${width}.0, ${height}.0));
        }
    `;

    const createRenderPipeline = (device, format) => {
        return device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: device.createShaderModule({
                    code: vertexWgsl,
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 8, // 2 floats * 4 bytes
                        attributes: [
                            {
                                format: "float32x2",
                                offset: 0,
                                shaderLocation: 0,
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: device.createShaderModule({
                    code: fragmentWgsl,
                }),
                entryPoint: "main",
                targets: [{ format }],
            },
            primitive: {
                topology: "triangle-list",
            },
        });
    };

    const createComputePipeline = (device, module) => {
        return device.createComputePipeline({
            layout: "auto",
            compute: {
                module,
                entryPoint: "main",
            },
        });
    };

    const createTexture = (device, width, height) => {
        return device.createTexture({
            size: [width, height],
            format: "rgba8unorm",
            usage:
                GPUTextureUsage.STORAGE_BINDING |
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST,
        });
    };

    const pixelPosToComplex = (x, y) => {
        return {
            x: ((x - width / 2) * scale) / size + offsetX,
            y: ((y - height / 2) * scale) / size + offsetY,
        };
    };

    async function initAudio() {
        try {
            if (!audioContext) {
                audioContext = new AudioContext();
            }

            if (audioElement) {
                // If we were playing audio file, disconnect it
                if (audioSource) {
                    audioSource.disconnect();
                }
                audioElement.pause();
            }

            // Request microphone access
            microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    latency: {
                        ideal: 0.0,
                    },
                },
            });

            // Create nodes
            const source =
                audioContext.createMediaStreamSource(microphoneStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;

            // Connect nodes
            source.connect(analyser);

            // Create buffer for time domain data
            timeData = new Float32Array(analyser.fftSize);
            frequencyData = new Float32Array(analyser.frequencyBinCount);
            previousFrequencyData = new Float32Array(
                analyser.frequencyBinCount,
            );

            audioInitialized = true;
            isListening = true;
            isPlaying = false;
        } catch (error) {
            console.error("Error initializing audio:", error);
            isListening = false;
        }
    }

    async function playAudioFile() {
        try {
            if (!audioContext) {
                audioContext = new AudioContext();
            }

            if (microphoneStream) {
                // If we were listening to mic, stop it
                await stopAudio();
            }

            if (!audioElement) {
                audioElement = new Audio(demoAudio);
                audioElement.crossOrigin = "anonymous";
            }

            if (!audioSource) {
                audioSource =
                    audioContext.createMediaElementSource(audioElement);
            }

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);

            timeData = new Float32Array(analyser.fftSize);
            frequencyData = new Float32Array(analyser.frequencyBinCount);
            previousFrequencyData = new Float32Array(
                analyser.frequencyBinCount,
            );

            await audioElement.play();

            audioInitialized = true;
            isPlaying = true;
            isListening = false;
        } catch (error) {
            console.error("Error playing audio:", error);
            isPlaying = false;
        }
    }

    async function stopAudioFile() {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            if (audioSource) {
                audioSource.disconnect();
            }
        }
        isPlaying = false;
    }

    async function stopAudio() {
        if (microphoneStream) {
            microphoneStream.getTracks().forEach((track) => track.stop());
        }
        if (audioContext) {
            await audioContext.close();
        }
        audioInitialized = false;
        isListening = false;
    }

    function updateAudioRadius(timestamp) {
        if (!audioInitialized) return;
        if (!lastTime) {
            lastTime = timestamp;
            return;
        }
        audioFrame++;
        const deltaT = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        totalTime += deltaT;

        // Get time domain data
        analyser.getFloatTimeDomainData(timeData);
        let tmpFrequencyData = previousFrequencyData;
        previousFrequencyData = frequencyData;
        frequencyData = tmpFrequencyData;
        analyser.getFloatFrequencyData(frequencyData);

        // Calculate average power (sum of squared samples)
        // for (let i = 0; i < timeData.length; i++) {
        //     power += timeData[i] * timeData[i];
        // }
        const previousPowerState = powerState;
        const lowFrequency = 120;
        const highFrequency = 14000;
        const lowFrequencyIndex = Math.floor(
            (lowFrequency / sampleRate) * 2.0 * frequencyData.length,
        );
        const highFrequencyIndex = Math.floor(
            (highFrequency / sampleRate) * 2.0 * frequencyData.length,
        );
        const frequencyWeight = (freqIndex) => {
            const range = highFrequencyIndex - lowFrequencyIndex;
            const place = (freqIndex - lowFrequencyIndex) / range;
            const lessMiddle = 0.6 + Math.cos(place * Math.PI * 2) * 0.4;
            const spectral = Math.sqrt(freqIndex + 100) / 10;
            return lessMiddle / spectral;
        };
        let power = 0;
        for (let i = lowFrequencyIndex; i <= highFrequencyIndex; i++) {
            const delta = frequencyData[i] - previousFrequencyData[i];
            const value = Math.min(Math.max(delta || 0, 0), 120) ** 2;
            power += value * frequencyWeight(i);
        }
        // deal with weird first few frames
        if (audioFrame < 16) {
            return;
        }
        const decay = Math.pow(0.5, deltaT * 8);
        const powerDelta = power;
        powerDeltaState = Math.max(
            powerDeltaState * decay + Math.max(powerDelta, 0),
            0,
        );
        const gainDecay =
            audioFrame < sampleRate / 4
                ? Math.pow(0.5, deltaT * 4)
                : Math.pow(0.5, deltaT / 30);
        noiseState *= gainDecay;
        gainState = Math.max(
            decay * gainState + (1 - decay) * Math.max(powerDeltaState, 0),
            gainDecay * gainState,
            1e-6,
        );

        powerState = power;

        let powerVis = Math.max(0, powerDeltaState / gainState);
        powerVis = Math.log(8 * powerVis ** 2 + 1) / Math.log(8 + 1);

        totalTime += deltaT * Math.min(Math.sqrt(powerVis) * 200, 2);

        // Map to radius range (0.257 down)
        audioRadius = 0.265 - powerVis * 0.007;
        scale = 1.5 - powerVis * 0.06;
        juliaAngle =
            Math.sin((2 * Math.PI * totalTime) / 240) * Math.PI * 0.84 +
            Math.PI;

        const debugCanvas = document.getElementById("debug-canvas");
        const debugCtx = debugCanvas.getContext("2d");
        debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
        debugCtx.fillStyle = "#000";
        debugCtx.fillRect(0, 0, debugCanvas.width, debugCanvas.height);
        debugCtx.fillStyle = "#000";

        // frequency bars
        const barWidth = debugCanvas.width / frequencyData.length;
        for (let i = 0; i < frequencyData.length; i++) {
            if (i < lowFrequencyIndex || i > highFrequencyIndex) {
                debugCtx.fillStyle = "#00e";
            } else {
                const weight = frequencyWeight(i);
                debugCtx.fillStyle = `hsl(30, ${weight * 100}%, 50%)`;
            }

            const barHeight =
                ((frequencyData[i] + 120) / 200) * debugCanvas.height;
            debugCtx.fillRect(
                (i - lowFrequencyIndex) * barWidth,
                debugCanvas.height - barHeight,
                barWidth,
                barHeight,
            );
        }

        // visualize instantaneous power delta & stateful power delta as two bars on the left
        debugCtx.fillStyle = "#00e";
        const barHeight = ((powerDelta / gainState) * debugCanvas.height) / 2;
        debugCtx.fillRect(0, debugCanvas.height - barHeight, 8, barHeight);
        const barHeight2 =
            ((powerDeltaState / gainState) * debugCanvas.height) / 2;
        debugCtx.fillRect(8, debugCanvas.height - barHeight2, 8, barHeight2);
        const barHeight3 = (powerVis * debugCanvas.height) / 2;
        debugCtx.fillRect(16, debugCanvas.height - barHeight3, 8, barHeight3);
    }

    let animationFrameId;
    async function init() {
        if (!navigator.gpu) {
            webgpuSupported = false;
            webgpuError = "Your browser does not support WebGPU";
            return;
        }

        console.log("Initializing WebGPU");

        // Get WebGPU adapter and device
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            webgpuSupported = false;
            webgpuError = "The WebGPU adapter is not available on your system";
            return;
        }

        const device = await adapter.requestDevice();

        // Setup Julia canvas
        const juliaCanvas = document.getElementById("julia-canvas");
        juliaCanvas.width = width;
        juliaCanvas.height = height;
        const juliaContext = juliaCanvas.getContext("webgpu");
        const juliaFormat = navigator.gpu.getPreferredCanvasFormat();
        juliaContext.configure({
            device,
            format: juliaFormat,
            alphaMode: "premultiplied",
        });

        // Create storage texture for Julia set
        const juliaTexture = device.createTexture({
            size: [width, height, 1],
            format: "rgba8unorm",
            usage:
                GPUTextureUsage.STORAGE_BINDING |
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_SRC,
        });

        // Create uniform buffer for Julia parameters
        const juliaUniformBuffer = device.createBuffer({
            size: 9 * 4, // 9 f32 values
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Create compute pipeline for Julia set
        const juliaComputeModule = device.createShaderModule({
            label: "Julia compute shader",
            code: juliaWgsl,
        });

        const juliaComputePipeline = device.createComputePipeline({
            layout: "auto",
            compute: {
                module: juliaComputeModule,
                entryPoint: "main",
            },
        });

        // Create bind group for Julia compute shader
        const juliaComputeBindGroup = device.createBindGroup({
            layout: juliaComputePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: juliaTexture.createView(),
                },
                {
                    binding: 1,
                    resource: {
                        buffer: juliaUniformBuffer,
                    },
                },
            ],
        });

        // Create vertex shader module
        const vertexModule = device.createShaderModule({
            label: "Vertex shader",
            code: vertexWgsl,
        });

        // Create fragment shader module
        const fragmentModule = device.createShaderModule({
            label: "Fragment shader",
            code: fragmentWgsl,
        });

        // Create render pipeline
        const renderPipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: vertexModule,
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 2 * 4,
                        attributes: [
                            {
                                format: "float32x2",
                                offset: 0,
                                shaderLocation: 0,
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: fragmentModule,
                entryPoint: "main",
                targets: [
                    {
                        format: juliaFormat,
                    },
                ],
            },
            primitive: {
                topology: "triangle-list",
            },
        });

        // Create vertex buffer
        const vertices = new Float32Array([
            -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
        ]);
        const vertexBuffer = device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
        vertexBuffer.unmap();

        // Create sampler for texture rendering
        const sampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });

        // Create bind group for rendering
        const renderBindGroup = device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: juliaTexture.createView(),
                },
                {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });

        function render(deltaT) {
            frameCount++;
            const now = performance.now();

            const juliaIterations = 128;

            if (juliaIterations > 0) {
                lastJuliaUpdate = now;

                // Update audio-based radius
                updateAudioRadius(deltaT);

                // Calculate c value based on angle and audio-modulated radius
                const c_re = -1 + audioRadius * Math.cos(juliaAngle);
                const c_im = audioRadius * Math.sin(juliaAngle);

                // Update Julia set parameters
                device.queue.writeBuffer(
                    juliaUniformBuffer,
                    0,
                    new Float32Array([
                        width,
                        height,
                        juliaIterations,
                        scale,
                        offsetX,
                        offsetY,
                        exponent,
                        c_re,
                        c_im,
                    ]),
                );

                // Compute Julia set
                const commandEncoder = device.createCommandEncoder();
                const juliaPass = commandEncoder.beginComputePass();
                juliaPass.setPipeline(juliaComputePipeline);
                juliaPass.setBindGroup(0, juliaComputeBindGroup);
                juliaPass.dispatchWorkgroups(
                    Math.ceil(width / WORKGROUP_SIZE),
                    Math.ceil(height / WORKGROUP_SIZE),
                );
                juliaPass.end();

                // Render Julia texture to canvas
                const renderPass = commandEncoder.beginRenderPass({
                    colorAttachments: [
                        {
                            view: juliaContext.getCurrentTexture().createView(),
                            clearValue: { r: 0, g: 0, b: 0, a: 1 },
                            loadOp: "clear",
                            storeOp: "store",
                        },
                    ],
                });
                renderPass.setPipeline(renderPipeline);
                renderPass.setBindGroup(0, renderBindGroup);
                renderPass.setVertexBuffer(0, vertexBuffer);
                renderPass.draw(6, 1, 0, 0);
                renderPass.end();

                const commandBuffer = commandEncoder.finish();
                device.queue.submit([commandBuffer]);
            }

            // Request next frame
            animationFrameId = requestAnimationFrame(render);
        }

        render();
    }

    onDestroy(() => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        stopAudio();
    });

    init().catch(console.error);

    onMount(() => {
        // Audio will be initialized by button click
    });
</script>

<svelte:head>
    <title>Julia Set Explorer</title>
</svelte:head>

<div class="flex flex-col gap-2 items-center">
    {#if !webgpuSupported}
        <div class="error-message max-w-xl">
            <p>{webgpuError}</p>
            <p>
                Please use a browser that supports WebGPU, such as Chrome Canary
                with the appropriate flags enabled. Either navigate to
                <code>chrome://flags</code> and enable "Unsafe WebGPU" or use the
                command line flag:
            </p>
        </div>
    {:else}
        <div class="flex flex-col items-center gap-4">
            <canvas id="julia-canvas"></canvas>
            <canvas id="debug-canvas"></canvas>
            <div class="controls">
                <label>
                    <span>Angle:</span>
                    <input
                        type="range"
                        min="0"
                        max={2 * Math.PI}
                        step="0.01"
                        bind:value={juliaAngle}
                    />
                    <span class="value"
                        >{(juliaAngle / Math.PI).toFixed(2)}π</span
                    >
                </label>
                <div class="button-group">
                    <button
                        class="control-button"
                        onclick={() => {
                            if (isListening) {
                                stopAudio();
                            } else {
                                initAudio();
                            }
                        }}
                        disabled={isPlaying}
                    >
                        {isListening ? "Stop Listening" : "Start Listening"}
                    </button>
                    <button
                        class="control-button"
                        onclick={() => {
                            if (isPlaying) {
                                stopAudioFile();
                            } else {
                                playAudioFile();
                            }
                        }}
                        disabled={isListening}
                    >
                        {isPlaying ? "Stop Playing" : "Play Audio"}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    canvas {
        border: 1px solid #333;
    }
    div {
        margin-bottom: 1em;
    }
    .error-message {
        background-color: #fee;
        border: 1px solid #faa;
        border-radius: 4px;
        padding: 1rem;
        padding-left: 2rem;
        padding-right: 2rem;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }
    p {
        margin-bottom: 0.7rem;
    }
    .controls {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .controls label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .controls input[type="range"] {
        width: 200px;
    }

    .controls .value {
        min-width: 3.5em;
        text-align: right;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .control-button {
        background-color: #4a5568;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s;
    }

    .control-button:hover:not(:disabled) {
        background-color: #2d3748;
    }

    .control-button:active:not(:disabled) {
        background-color: #1a202c;
    }

    .control-button:disabled {
        background-color: #718096;
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
