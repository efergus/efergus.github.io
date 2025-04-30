<script>
    import { run } from 'svelte/legacy';

    import Code from "$lib/components/Code.svelte";
    import Eq from "$lib/components/Eq.svelte";
    import { onMount, onDestroy } from "svelte";
    const WORKGROUP_SIZE = 8;

    // Canvas dimensions
    const width = 540;
    const height = 360;
    const size = Math.max(width, height);

    // Camera state
    let scale = $state(3.0);
    let offsetX = $state(-0.7);
    let offsetY = $state(0.0);
    let exponent = $state(2.0);
    let isDragging = false;
    let isHovering = $state(false);
    let lastMouseX = 0;
    let lastMouseY = 0;
    let hoverMouseX = $state(0);
    let hoverMouseY = $state(0);
    let clickedMouseX = 0;
    let clickedMouseY = 0;
    let lastMandelbrotUpdate = 0;
    let lastJuliaUpdate = 0;
    let frameCount = 0;
    let frameLogTime = 0;
    let juliaX = $state(0);
    let juliaY = $state(0);

    let webgpuSupported = $state(true);
    let webgpuError = $state("");

    let overlayCanvas = $state();

    const complexPow = ({ re, im }, n) => {
        if (n === 2) {
            return {
                re: re * re - im * im,
                im: 2.0 * re * im,
            };
        }

        const r = Math.sqrt(z_re * z_re + z_im * z_im);
        if (r === 0) {
            return { re: 0, im: 0 };
        }
        const theta = Math.atan2(z_im, z_re);
        const r_n = Math.pow(r, n);
        const theta_n = n * theta;
        return {
            re: r_n * Math.cos(theta_n),
            im: r_n * Math.sin(theta_n),
        };
    };

    const evaluateMandelbrotIteration = (z, exponent, c) => {
        const { re, im } = complexPow(z, exponent);
        return {
            re: re + c.re,
            im: im + c.im,
        };
    };

    const drawIterations = (juliaX, juliaY, mandelbrotIterations = 64) => {
        const mandelbrotOverlayContext = overlayCanvas?.getContext("2d");
        if (!mandelbrotOverlayContext) {
            return;
        }
        mandelbrotOverlayContext.clearRect(0, 0, width, height);
        if (!isHovering) {
            return;
        }

        const path = [];
        const c = { re: juliaX, im: juliaY };
        let pos = c;
        for (let idx = 0; idx < mandelbrotIterations; idx++) {
            const pixelPos = complexToPixelPos(pos.re, pos.im);
            path.push(pixelPos);
            pos = evaluateMandelbrotIteration(pos, exponent, c);
            if (pos.re * pos.re + pos.im * pos.im > 16) {
                break;
            }
        }

        mandelbrotOverlayContext.strokeStyle = "#201080";
        mandelbrotOverlayContext.lineWidth = 2;
        mandelbrotOverlayContext.fillStyle = "#b0c880";

        mandelbrotOverlayContext.beginPath();
        const start = path[0];
        mandelbrotOverlayContext.moveTo(start.x, start.y);
        for (let idx = 1; idx < path.length; idx++) {
            const pos = path[idx];
            mandelbrotOverlayContext.lineTo(pos.x, pos.y);
        }
        mandelbrotOverlayContext.stroke();
        mandelbrotOverlayContext.closePath();

        for (let idx = path.length - 1; idx >= 0; idx--) {
            mandelbrotOverlayContext.beginPath();
            const pos = path[idx];
            mandelbrotOverlayContext.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
            mandelbrotOverlayContext.stroke();
            mandelbrotOverlayContext.fill();
            mandelbrotOverlayContext.closePath();
        }
    };

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

    const mandelbrotWgsl = `
        @group(0) @binding(0) var output: texture_storage_2d<rgba8unorm, write>;

        struct Params {
            width: f32,
            height: f32,
            max_iterations: f32,
            scale: f32,
            offset_x: f32,
            offset_y: f32,
            power: f32,
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
            let c_re = (f32(x) - width / 2.0) * scale / size + offset_x;
            let c_im = (f32(y) - height / 2.0) * scale / size + offset_y;

            var z_re = 0.0;
            var z_im = 0.0;
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

            // let angle = atan2(z_im, z_re);
            // let magnitude = sqrt(z_re * z_re + z_im * z_im);
            // let color = vec4<f32>(clamp(0.4 * magnitude, 0.0, 1.0), (cos(angle) + 1.0) / 2.0, (sin(angle) + 1.0) / 2.0, 1.0);
            // let mag = log2(1.0 + 0.4 * sqrt(z_re * z_re + z_im * z_im));
            // let color = vec4<f32>(mag, mag, mag, 1.0);

            textureStore(output, vec2<u32>(x, y), color);
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
            // let color = vec4<f32>(1.0, z_re, z_im, 1.0);

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

    const complexToPixelPos = (x, y) => {
        return {
            x: (x - offsetX) * (size / scale) + width / 2,
            y: (y - offsetY) * (size / scale) + height / 2,
        };
    };

    run(() => {
        juliaX = ((hoverMouseX - width / 2) * scale) / size + offsetX;
        juliaY = ((hoverMouseY - height / 2) * scale) / size + offsetY;
    });

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

        // Setup canvas
        const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");
        const mandelbrotContext = mandelbrotCanvas.getContext("webgpu");

        const juliaCanvas = document.getElementById("julia-canvas");
        const juliaContext = juliaCanvas.getContext("webgpu");

        const mandelbrotOverlay = document.getElementById("mandelbrot-overlay");
        const mandelbrotOverlayContext = mandelbrotOverlay.getContext("2d");

        console.log("Initialized WebGPU");

        // Set canvas size
        mandelbrotCanvas.width = width;
        mandelbrotCanvas.height = height;
        juliaCanvas.width = width;
        juliaCanvas.height = height;
        mandelbrotOverlay.width = width;
        mandelbrotOverlay.height = height;

        // Configure canvas format
        const format = navigator.gpu.getPreferredCanvasFormat();
        mandelbrotContext.configure({
            device,
            format,
            alphaMode: "premultiplied",
        });
        juliaContext.configure({
            device,
            format,
            alphaMode: "premultiplied",
        });

        console.log("Configured canvas");

        // Create compute shader
        const computeShaderModule = device.createShaderModule({
            label: "Mandelbrot compute shader",
            code: mandelbrotWgsl,
        });
        const juliaComputeShaderModule = device.createShaderModule({
            label: "Julia compute shader",
            code: juliaWgsl,
        });

        console.log("Created compute shader");

        // Create vertex buffer for the quad
        const vertices = new Float32Array([
            -1.0,
            -1.0, // Triangle 1
            1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            -1.0, // Triangle 2
            1.0,
            1.0,
            -1.0,
            1.0,
        ]);

        const vertexBuffer = device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
        vertexBuffer.unmap();

        console.log("Created vertex buffer");

        // Create render pipeline
        const mandelbrotRenderPipeline = createRenderPipeline(device, format);
        const juliaRenderPipeline = createRenderPipeline(device, format);

        console.log("Created render pipeline");

        // Create compute pipeline
        const mandelbrotComputePipeline = createComputePipeline(
            device,
            computeShaderModule,
        );
        const juliaComputePipeline = createComputePipeline(
            device,
            juliaComputeShaderModule,
        );

        console.log("Created compute pipeline");

        // Create texture for compute shader output
        const mandelbrotTexture = createTexture(device, width, height);
        const juliaTexture = createTexture(device, width, height);

        // Create sampler for rendering
        const mandelbrotSampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });
        const juliaSampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });

        // Create uniform buffer for parameters
        const mandelbrotUniformBuffer = device.createBuffer({
            size: 28, // 7 * 4 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const juliaUniformBuffer = device.createBuffer({
            size: 36, // 9 * 4 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Create bind groups
        const mandelbrotComputeBindGroup = device.createBindGroup({
            layout: mandelbrotComputePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: mandelbrotTexture.createView(),
                },
                {
                    binding: 1,
                    resource: { buffer: mandelbrotUniformBuffer },
                },
            ],
        });

        const juliaComputeBindGroup = device.createBindGroup({
            layout: juliaComputePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: juliaTexture.createView(),
                },
                {
                    binding: 1,
                    resource: { buffer: juliaUniformBuffer },
                },
            ],
        });

        const mandelbrotRenderBindGroup = device.createBindGroup({
            layout: mandelbrotRenderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: mandelbrotTexture.createView(),
                },
                {
                    binding: 1,
                    resource: mandelbrotSampler,
                },
            ],
        });

        const juliaRenderBindGroup = device.createBindGroup({
            layout: juliaRenderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: juliaTexture.createView(),
                },
                {
                    binding: 1,
                    resource: juliaSampler,
                },
            ],
        });

        // Render function
        function render() {
            frameCount++;
            const now = performance.now();
            const mandelbrotIterations = Math.min(
                Math.floor(
                    (now - lastMandelbrotUpdate) / 50 +
                        Math.min(1 / scale, 160) +
                        64,
                ),
                256,
            );
            const juliaIterations = Math.min(
                Math.floor(
                    (now - lastJuliaUpdate) / 50 +
                        Math.min(1 / scale, 180) +
                        32,
                ),
                256,
            );
            // Skip frames to avoid too many updates
            if (
                frameCount % 2 ||
                (mandelbrotIterations >= 256 && juliaIterations >= 256)
            ) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Update uniform buffer with current parameters
            const mandelbrotParams = new Float32Array([
                width, // width
                height, // height
                mandelbrotIterations, // max_iterations
                scale, // scale
                offsetX, // offset_x
                offsetY, // offset_y
                exponent, // exponent
            ]);
            device.queue.writeBuffer(
                mandelbrotUniformBuffer,
                0,
                mandelbrotParams,
            );

            // Update Julia uniform buffer
            const juliaParams = new Float32Array([
                width, // width
                height, // height
                juliaIterations, // max_iterations
                3.4, // scale
                offsetX, // offset_x
                offsetY, // offset_y
                exponent, // exponent
                juliaX, // julia_x
                juliaY, // julia_y
            ]);
            device.queue.writeBuffer(juliaUniformBuffer, 0, juliaParams);

            // Create command encoder
            const commandEncoder = device.createCommandEncoder();

            // Compute pass
            const mandelbrotComputePass = commandEncoder.beginComputePass();
            mandelbrotComputePass.setPipeline(mandelbrotComputePipeline);
            mandelbrotComputePass.setBindGroup(0, mandelbrotComputeBindGroup);
            mandelbrotComputePass.dispatchWorkgroups(
                Math.ceil(width / WORKGROUP_SIZE),
                Math.ceil(height / WORKGROUP_SIZE),
            );
            mandelbrotComputePass.end();

            const juliaComputePass = commandEncoder.beginComputePass();
            juliaComputePass.setPipeline(juliaComputePipeline);
            juliaComputePass.setBindGroup(0, juliaComputeBindGroup);
            juliaComputePass.dispatchWorkgroups(
                Math.ceil(width / WORKGROUP_SIZE),
                Math.ceil(height / WORKGROUP_SIZE),
            );
            juliaComputePass.end();

            // Get current texture views
            const mandelbrotTextureView = mandelbrotContext
                .getCurrentTexture()
                .createView();
            const juliaTextureView = juliaContext
                .getCurrentTexture()
                .createView();

            // Render pass
            const mandelbrotRenderPass = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: mandelbrotTextureView,
                        clearValue: { r: 0, g: 0, b: 0, a: 1 },
                        loadOp: "clear",
                        storeOp: "store",
                    },
                ],
            });
            mandelbrotRenderPass.setPipeline(mandelbrotRenderPipeline);
            mandelbrotRenderPass.setBindGroup(0, mandelbrotRenderBindGroup);
            mandelbrotRenderPass.setVertexBuffer(0, vertexBuffer);
            mandelbrotRenderPass.draw(6, 1, 0, 0);
            mandelbrotRenderPass.end();

            const juliaRenderPass = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: juliaTextureView,
                        clearValue: { r: 0, g: 0, b: 0, a: 1 },
                        loadOp: "clear",
                        storeOp: "store",
                    },
                ],
            });
            juliaRenderPass.setPipeline(juliaRenderPipeline);
            juliaRenderPass.setBindGroup(0, juliaRenderBindGroup);
            juliaRenderPass.setVertexBuffer(0, vertexBuffer);
            juliaRenderPass.draw(6, 1, 0, 0);
            juliaRenderPass.end();

            // Submit commands and destroy encoder
            const commandBuffer = commandEncoder.finish();
            device.queue.submit([commandBuffer]);

            // Request next frame
            animationFrameId = requestAnimationFrame(render);

            drawIterations(juliaX, juliaY);
        }

        // Event listeners for controls
        mandelbrotCanvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const zoomFactor = Math.exp(e.deltaY / 1000);

            const mousePos = pixelPosToComplex(hoverMouseX, hoverMouseY);

            // Adjust scale
            scale *= zoomFactor;

            // Adjust offset to keep mouse position fixed
            offsetX = mousePos.x - (hoverMouseX - width / 2) * (scale / size);
            offsetY = mousePos.y - (hoverMouseY - height / 2) * (scale / size);
            lastMandelbrotUpdate = performance.now();
            lastJuliaUpdate = performance.now();
        });

        mandelbrotCanvas.addEventListener("mousedown", (e) => {
            const mandelbrotRect = mandelbrotCanvas.getBoundingClientRect();
            const mouseX = e.clientX - mandelbrotRect.left;
            const mouseY = e.clientY - mandelbrotRect.top;
            clickedMouseX = mouseX;
            clickedMouseY = mouseY;
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            mandelbrotCanvas.style.cursor = "grabbing";
            lastMandelbrotUpdate = performance.now();
            lastJuliaUpdate = performance.now();
        });

        mandelbrotCanvas.addEventListener("mousemove", (e) => {
            const mandelbrotRect = mandelbrotCanvas.getBoundingClientRect();
            const mouseX = e.clientX - mandelbrotRect.left;
            const mouseY = e.clientY - mandelbrotRect.top;
            const mousePos = pixelPosToComplex(mouseX, mouseY);
            if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;

                offsetX -= dx * (scale / size);
                offsetY -= dy * (scale / size);

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                lastMandelbrotUpdate = performance.now();
            }
            hoverMouseX = mouseX;
            hoverMouseY = mouseY;
            lastJuliaUpdate = performance.now();
            isHovering = true;
        });

        mandelbrotCanvas.addEventListener("mouseup", () => {
            isDragging = false;
            mandelbrotCanvas.style.cursor = "grab";
        });

        mandelbrotCanvas.addEventListener("mouseleave", () => {
            isDragging = false;
            hoverMouseX = clickedMouseX;
            hoverMouseY = clickedMouseY;
            mandelbrotCanvas.style.cursor = "grab";
            lastJuliaUpdate = performance.now();
            isHovering = false;
        });

        // Keyboard controls
        window.addEventListener("keydown", (e) => {
            const moveAmount = 0.1 * scale;
            switch (e.key) {
                case "ArrowLeft":
                case "a":
                    offsetX -= moveAmount;
                    break;
                case "ArrowRight":
                case "d":
                    offsetX += moveAmount;
                    break;
                case "ArrowUp":
                case "w":
                    offsetY -= moveAmount;
                    break;
                case "ArrowDown":
                case "s":
                    offsetY += moveAmount;
                    break;
            }
        });

        // Set initial cursor style
        mandelbrotCanvas.style.cursor = "grab";

        // Start rendering
        render();
    }
    onDestroy(() => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    init().catch(console.error);
</script>

<svelte:head>
    <title>WebGPU Mandelbrot</title>
</svelte:head>

<div class="flex flex-col gap-2 items-center">
    <div class="max-w-xl">
        <h1 class="emphasize">WebGPU Mandelbrot</h1>
    </div>

    {#if !webgpuSupported}
        <div class="error-message max-w-xl">
            <p>{webgpuError}</p>
            <p>
                Please use a browser that supports WebGPU, such as Chrome Canary
                with the appropriate flags enabled. Either navigate to
                <code>chrome://flags</code> and enable "Unsafe WebGPU" or use the
                command line flag:
            </p>
            <Code source={"google-chrome --enable-unsafe-webgpu"} lang={"sh"} />
        </div>
    {:else}
        <div class="flex gap-2 flex-wrap relative">
            <canvas id="mandelbrot-canvas"></canvas>
            <canvas id="julia-canvas"></canvas>
            <canvas
                bind:this={overlayCanvas}
                id="mandelbrot-overlay"
                class="absolute left-0 top-0 pointer-events-none"
            ></canvas>
            {#if isHovering && hoverMouseY > 0}
                <p
                    class="absolute left-0 top-0 pointer-events-none text-[20px] px-2 rounded-md font-[math]"
                    style={`transform: translate(${hoverMouseX + 6}px, ${hoverMouseY - 28}px); background-color: rgba(255, 255, 255, 0.75);`}
                >
                    c = {juliaX.toFixed(2)} + {juliaY.toFixed(2)}i
                </p>
            {/if}
        </div>
        <div class="controls">
            <label>
                Exponent:
                <input
                    type="range"
                    min="1"
                    max="14"
                    step="0.1"
                    bind:value={exponent}
                />
                <span class="value">{exponent.toFixed(1)}</span>
            </label>
        </div>
    {/if}
    <div class="max-w-xl">
        <p>
            On the left is the Mandelbrot set. Scroll to zoom in, click and drag
            to pan, and use the arrow keys to navigate.
        </p>
        <p>
            I also have a little music visualization based on the Julia set <a
                href="/projects/webgpu-music">here</a
            >
        </p>
        <p>The relationship that creates all this complexity is</p>
        <div class="text-lg">
            <Eq
                tex={`
            \\begin{align*}
                f_c(z) &= z^d + c \\\\
                c &= \\text{x} + \\text{y}i \\\\
                \\text{w}&\\text{here} \\\\
                f_c(0),\\; f_c(f_c(0)), &\\dots \\; \\text{is bounded}
            \\end{align*}
            `}
                block
            />
        </div>
        <p>
            where <Eq tex={"c"} /> is a complex number and
            <Eq tex={"d"} /> is the exponent. Each point in the image is a different
            value of <Eq tex={"c"} />. When you hover, the dots are the
            progression of the specific point you're hovering over.
        </p>
        <p>
            On the right is the Julia set, a sister set of the Mandelbrot set.
            It is defined by the same relationship, but <Eq tex={"c"} /> is fixed
            and each point shows the evolution of <Eq
                tex={"z = \\text{x} + \\text{y}i"}
            />. When you move the mouse, the Julia set updates to show the
            corresponding point. Also, technically the Julia set is the edge of
            the set shown - the set of points where arbitrarily small
            perturbations cause drastic changes in behavior.
        </p>
        <p>
            If you move your mouse around near the edge of the Mandelbrot set,
            you'll notice something interesting. The points where <Eq
                tex={"c"}
            /> is inside the Mandelbrot set are exactly the points where the Julia
            set is connected!
        </p>
        <p>
            Zoom in enough, and you'll see the image starts to get pixelated.
            This is actually due to the limited precision of 32-bit floating
            point numbers in the shader. Unfortunately, WebGPU does not support
            64-bit floating point numbers at the time of writing, which would
            allow for much more precision.
        </p>
        <p>
            To view the code, head to <a
                href="https://github.com/efergus/efergus.github.io/tree/main/src/routes/projects/webgpu-mandelbrot"
                target="_blank"
            >
                the repository
            </a>.
        </p>
    </div>
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
        justify-content: center;
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
        min-width: 2.5em;
        text-align: right;
    }
</style>
