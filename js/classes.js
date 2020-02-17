class threeDimensions {
    constructor() {
        this.lights = [];
        this.effects = [];
        this.animation = function() {};
    }

    /**
     * [ACTIONS] MAIN
     */

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();

        window.addEventListener('resize', function () {
            this.resizeCanvas();
        }.bind(this));
    }

    render() {
        let animate = function () {

            requestAnimationFrame(animate);

            this.animation();

            if (this.composer) {
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }.bind(this);

        animate();
    }

    resizeCanvas() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    enableDebugMode() {
        // log the scene
        console.log(this.scene);

        // enable helper for axes
        this.scene.add(new THREE.AxesHelper(100));

        // enable helper for all lights on the scene
        for (let light of this.lights) {
            let lightHelper,
                cameraHelper = new THREE.CameraHelper(light.shadow.camera);

            if (light.type === 'PointLight')
                lightHelper = new THREE.PointLightHelper(light, .2);
            else if (light.type === 'DirectionalLight')
                lightHelper = new THREE.DirectionalLightHelper(light, 1);
            else if (light.type === 'SpotLight')
                lightHelper = new THREE.SpotLightHelper(light);
            else
                console.log("Light's type wasn't found");

            this.scene.add(lightHelper);
            this.scene.add(cameraHelper);
        }
    }

    enableShadow() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.size = 1024;
    }

    /**
     * [LOAD]
     */

    loadModel(model) {
        return new Promise(function(resolve, reject) {
            let loader = new THREE.GLTFLoader();

            loader.load(model, function(gltf, animations) {
                if (gltf.scene) {
                    this.scene.add(gltf.scene);
                    resolve(gltf);
                } else {
                    reject();
                }
            }.bind(this));
        }.bind(this));
    }

    loadSVG(svg) {
        return new Promise(function(resolve, reject) {
            let loader = new THREE.SVGLoader();

            loader.load(svg, function(data) {
                let paths = data.paths;
                let group = new THREE.Group();

                for (let path of paths) {
                    let material = this.getMaterial({
                        color: path.color,
                        side: THREE.DoubleSide,
                        depthWrite: true
                    });

                    let shapes = path.toShapes(true);

                    for (let shape of shapes) {
                        let geometry = new THREE.ShapeBufferGeometry(shape);
                        let mesh = new THREE.Mesh(geometry, material);

                        group.add(mesh);
                    }

                    this.scene.add(group);

                    resolve(group);
                }
            }.bind(this));
        }.bind(this));
    }

    loadTexture(texture) {
        return new THREE.TextureLoader().load(texture);
    }

    /**
     * [SET]
     */

    setBackgroundColor(backgroundColor) {
        this.scene.background = new THREE.Color(backgroundColor);
    }

    setToneMapping() {
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = .9;
    }

    setBackgroundGradient(color1, color2) {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();

        const texture = this.getGradientTexture(color1, color2);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        this.scene.background = envMap;
        this.scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();
    }

    /**
     * [CREATE] ENVIRONMENT
     */

    createScene() {
        this.scene = new THREE.Scene();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.set(5,5,5);
        this.camera.lookAt(0,0,0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(this.renderer.domElement );
    }

    createControls(minDistance=2, maxDistance=10) {
        this.controls = new THREE.OrbitControls( canvas.camera, canvas.renderer.domElement );
        this.controls.minDistance = minDistance;
        this.controls.maxDistance = maxDistance;
        this.controls.update();
    }

    /**
     * [CREATE] LIGHT
     */

    createPointLight(color="#f7f7f7", intensity=1, x=1, y=1, z=1) {
        let light = new THREE.PointLight(color, intensity, 6);

        light.position.set(x, y, z);
        light.castShadow = true;
        light.shadow.radius = 10;

        this.lights.push(light);
        this.scene.add(light);

        return light;
    }

    createSpotLight(color="#f7f7f7", x=1, y=1, z=1) {
        let light = new THREE.SpotLight(color);

        light.position.set(x, y, z);
        light.castShadow = true;
        light.shadow.radius = 10;

        this.lights.push(light);
        this.scene.add(light);

        return light;
    }

    createDirectionalLight(direction=false, color="#f7f7f7", intensity=1, x=1, y=1, z=1, distance=10) {
        let light = new THREE.DirectionalLight(color, intensity);

        light.position.set(x, y, z);
        light.castShadow = true;
        light.shadow.camera.lookAt(0,0,0);
        light.shadow.camera = new THREE.PerspectiveCamera( 45, 1, 0.1, distance );

        if (direction)
           light.target = direction;

        this.lights.push(light);
        this.scene.add(light);
        this.scene.add(light.target);

        return light;
    }

    createAmbientLight(color, size) {
        const light = new THREE.AmbientLight(color, size);

        this.scene.add(light);
    }

    /**
     * [CREATE] GEOMETRY
     */

    createFloor(width, height, material) {
        const mesh = this.getFloor(width, height, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;

        this.scene.add(mesh);

        return mesh;
    }

    createCircle(radius=1, segments=8, material) {
        let mesh = this.getCircle(radius, segments, material);

        mesh.castShadow = true;

        this.scene.add(mesh);

        return mesh;
    }

    createSphere(radius, segments, material) {
        let mesh = this.getSphere(radius, segments, material);

        mesh.castShadow = true;

        this.scene.add(mesh);

        return mesh;
    }

    createTorus(radius, tube, radialSegments, tubularSegments, material) {
        let mesh = this.getTorus(radius, tube, radialSegments, tubularSegments, material);
        this.scene.add(mesh);
        return mesh;
    }

    createCube() {
        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
    }

    /**
     * [GET] GEOMETRY
     */

    getFloor(width=20, height=20, material) {
        if (!material)
            material = this.getMaterial({color: "#f7f7f7", roughness: 0, metalness: 0});

        const geometry = new THREE.PlaneBufferGeometry(width, height, 1, 1);

        return new THREE.Mesh(geometry, material);
    }

    getSphere(radius=1, segments=8, material) {
        if (!material)
            material = this.getMaterial({color: "#f7f7f7"});

        let geometry = new THREE.SphereBufferGeometry(radius, segments, segments);

        return new THREE.Mesh(geometry, material);
    }

    getCircle(radius=1, segments=8, material) {
        if (!material)
            material = this.getMaterial({color: "#f7f7f7"});

        let geometry = new THREE.CircleBufferGeometry(radius, segments, segments);

        return new THREE.Mesh(geometry, material);
    }

    getTorus(radius, tube, radialSegments, tubularSegments, material) {
        if (!material)
            material = this.getMaterial({color: "#f7f7f7"});

        let geometry = new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments );

        return new THREE.Mesh( geometry, material );
    }

    /**
     * [GET] OTHER
     */

    getMaterial(options) {
        if (Object.keys(options).length === 1 && Object.keys(options)[0] === 'color')
            return new THREE.MeshBasicMaterial(options);
        else
            return new THREE.MeshPhysicalMaterial(options);
    }

    getGradientTexture(color1, color2) {
        let size = 512;

        // create canvas
        let canvas = document.createElement( 'canvas' );
        canvas.width = size;
        canvas.height = size;

        // get context
        let context = canvas.getContext( '2d' );

        // draw gradient
        context.rect( 0, 0, size, size );

        let gradient = context.createLinearGradient(0, 0, 0, size);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);

        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }

    /**
     * [CREATE] POSTPROCESSING
     */

    createComposer() {
        this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
        this.composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera));
    }

    saveEffects() {
        // Merge all effects into one pass
        const effectPass = new POSTPROCESSING.EffectPass(this.camera, ...this.effects);
        effectPass.renderToScreen = true;

        // Create a pass for each effect.
        const passes = this.effects.map((effect) => new POSTPROCESSING.EffectPass(this.camera, effect));
        passes[passes.length - 1].renderToScreen = true;

        // Add all passes to the composer.
        for(const pass of passes) {
            pass.enabled = false;
            this.composer.addPass(pass);
        }

        this.composer.addPass(effectPass);
    }

    createBloomEffect() {
        if (!this.composer)
            this.createComposer();

        const bloomEffect = new POSTPROCESSING.BloomEffect({
            blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
            kernelSize: POSTPROCESSING.KernelSize.MEDIUM,
            luminanceThreshold: 0.825,
            luminanceSmoothing: 0.075,
            height: 480
        });

        this.effects.push(bloomEffect);
    }

    createBokehEffect(focus=5) {
        if (!this.composer)
            this.createComposer();

        const bokehEffect = new POSTPROCESSING.RealisticBokehEffect({
            focus: focus,
            focalLength: this.camera.getFocalLength(),
            fStop: 1.6,
            luminanceThreshold: 0.325,
            luminanceGain: 2.0,
            bias: -0.35,
            fringe: 0.7,
            maxBlur: 2.5,
            rings: 5,
            samples: 5,
            showFocus: false,
            manualDoF: false,
            pentagon: true
        });

        this.effects.push(bokehEffect);
    }

    createGodRaysEffect(circle) {
        if (!this.composer)
            this.createComposer();

        const godRaysEffect = new POSTPROCESSING.GodRaysEffect(this.camera, circle, {
            resolutionScale: 1,
            density: .6,
            decay: .95,
            weight: .9,
            samples: 100
        });

        this.effects.push(godRaysEffect);
    }

    createGlitchEffect() {
        if (!this.composer)
            this.createComposer();

        const glitchEffect = new POSTPROCESSING.GlitchEffect();

        this.effects.push(glitchEffect);
    }

    createNoiseEffect() {
        if (!this.composer)
            this.createComposer();

        const noiseEffect = new POSTPROCESSING.NoiseEffect({
            blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE
        });

        noiseEffect.blendMode.opacity.value = 0.05;

        this.effects.push(noiseEffect);
    }
}