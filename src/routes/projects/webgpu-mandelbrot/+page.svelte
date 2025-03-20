<script>
    import Code from "$lib/components/Code.svelte";
    import { onMount } from "svelte";
    const WORKGROUP_SIZE = 8;

    // Camera state
    let scale = 3.0;
    let offsetX = -0.7;
    let offsetY = 0.0;
    let exponent = 2.0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let webgpuSupported = true;
    let webgpuError = "";

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

            var z_re = (f32(x) - width / 2.0) * scale / size + offset_x;
            var z_im = (f32(y) - height / 2.0) * scale / size + offset_y;
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
        const canvas = document.getElementById("webgpu-canvas");
        const context = canvas.getContext("webgpu");

        console.log("Initialized WebGPU");

        // Set canvas size
        const width = 800;
        const height = 600;
        canvas.width = width;
        canvas.height = height;

        // Configure canvas format
        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
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
        const renderPipeline = device.createRenderPipeline({
            layout: "auto",
            vertex: {
                module: device.createShaderModule({
                    code: `
                        struct VertexInput {
                            @location(0) position: vec2<f32>,
                        }

                        @vertex
                        fn main(input: VertexInput) -> @builtin(position) vec4<f32> {
                            return vec4<f32>(input.position, 0.0, 1.0);
                        }
                `,
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
                    code: `
                        @group(0) @binding(0) var tex: texture_2d<f32>;
                        @group(0) @binding(1) var texSampler: sampler;

                        @fragment
                        fn main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
                            return textureSample(tex, texSampler, pos.xy / vec2<f32>(${width}.0, ${height}.0));
                        }
                `,
                }),
                entryPoint: "main",
                targets: [{ format }],
            },
            primitive: {
                topology: "triangle-list",
            },
        });

        console.log("Created render pipeline");

        // Create compute pipeline
        const computePipeline = device.createComputePipeline({
            layout: "auto",
            compute: {
                module: computeShaderModule,
                entryPoint: "main",
            },
        });

        console.log("Created compute pipeline");

        // Create texture for compute shader output
        const texture = device.createTexture({
            size: [width, height],
            format: "rgba8unorm",
            usage:
                GPUTextureUsage.STORAGE_BINDING |
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST,
        });

        // Create sampler for rendering
        const sampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });

        // Create uniform buffer for parameters
        const uniformBuffer = device.createBuffer({
            size: 28, // 7 * 4 bytes
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Update parameters with better initial values
        const params = new Float32Array([
            width, // width
            height, // height
            100, // max_iterations
            scale, // scale
            offsetX, // offset_x
            offsetY, // offset_y
            exponent, // power
        ]);
        device.queue.writeBuffer(uniformBuffer, 0, params);

        // Create bind groups
        const computeBindGroup = device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: texture.createView(),
                },
                {
                    binding: 1,
                    resource: { buffer: uniformBuffer },
                },
            ],
        });

        const renderBindGroup = device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: texture.createView(),
                },
                {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });

        // Render function
        function render() {
            // Update uniform buffer with current parameters
            const params = new Float32Array([
                width,
                height,
                100,
                scale,
                offsetX,
                offsetY,
                exponent,
            ]);
            device.queue.writeBuffer(uniformBuffer, 0, params);

            // Create command encoder
            const commandEncoder = device.createCommandEncoder();

            // Compute pass
            const computePass = commandEncoder.beginComputePass();
            computePass.setPipeline(computePipeline);
            computePass.setBindGroup(0, computeBindGroup);
            computePass.dispatchWorkgroups(
                Math.ceil(width / WORKGROUP_SIZE),
                Math.ceil(height / WORKGROUP_SIZE),
            );
            computePass.end();

            // Render pass
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: context.getCurrentTexture().createView(),
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

            // Submit commands
            device.queue.submit([commandEncoder.finish()]);

            // Request next frame
            requestAnimationFrame(render);
        }

        // Event listeners for controls
        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            const zoomFactor = Math.exp(e.deltaY / 1000);

            // Get mouse position in canvas space
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Convert mouse position to complex plane coordinates
            const mouseComplexX =
                (mouseX - width / 2) * (scale / height) + offsetX;
            const mouseComplexY =
                (mouseY - height / 2) * (scale / height) + offsetY;

            // Adjust scale
            scale *= zoomFactor;

            // Adjust offset to keep mouse position fixed
            offsetX = mouseComplexX - (mouseX - width / 2) * (scale / height);
            offsetY = mouseComplexY - (mouseY - height / 2) * (scale / height);
        });

        canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            canvas.style.cursor = "grabbing";
        });

        canvas.addEventListener("mousemove", (e) => {
            if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;

                offsetX -= dx * (scale / height);
                offsetY -= dy * (scale / height);

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        canvas.addEventListener("mouseup", () => {
            isDragging = false;
            canvas.style.cursor = "grab";
        });

        canvas.addEventListener("mouseleave", () => {
            isDragging = false;
            canvas.style.cursor = "grab";
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
        canvas.style.cursor = "grab";

        // Start rendering
        render();
    }

    init().catch(console.error);
</script>

<svelte:head>
    <title>WebGPU Mandelbrot</title>
</svelte:head>

<div class="flex flex-col gap-2 items-center">
    <div class="max-w-xl">
        <h1 class="emphasize">WebGPU Mandelbrot</h1>
        <p>
            Hover over the canvas to zoom in, click and drag to pan, and use the
            arrow keys to navigate.
        </p>
        <p>This demo requires a browser that supports WebGPU.</p>
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
        <div class="controls">
            <label>
                Exponent:
                <input
                    type="range"
                    min="1"
                    max="14"
                    step="0.1"
                    bind:value={exponent}
                    on:input={render}
                />
                <span class="value">{exponent.toFixed(1)}</span>
            </label>
        </div>
        <canvas id="mandelbrot-canvas"></canvas>
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
