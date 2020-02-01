class threeDimensions {
    constructor() {

    }

    init() {
        this.setScene();
        this.setCamera();
        this.setRenderer();

        window.addEventListener('resize', function () {
            this.resizeCanvas();
        }.bind(this));
    }

    setScene() {
        this.scene = new THREE.Scene();
    }

    setBackgroundColor(backgroundColor) {
        this.scene.background = new THREE.Color(backgroundColor);
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(this.renderer.domElement );
    }

    setPointLight(color="#f7f7f7", intensity=1, x=.5, y=1, z=.5) {
        let light = new THREE.PointLight(color, intensity);
        light.position.set( x, y, z);
        light.castShadow = true;
        light.shadow.mapSize.height = 2048;
        light.shadow.mapSize.width = 2048;

        this.scene.add( light );
    }

    setDirectionalLight(color="#f7f7f7", intensity=.5, x=.5, y=1, z=.5) {
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set( x, y, z);
        light.castShadow = true;
        light.shadow.mapSize.height = 2048;
        light.shadow.mapSize.width = 2048;
        light.shadow.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );

        this.scene.add( light );
    }

    setAmbientLight(color, size) {
        const light = new THREE.AmbientLight(color, size);

        this.scene.add(light);
    }

    setControls(minDistance=2, maxDistance=10) {
        let controls = new THREE.OrbitControls( canvas.camera, canvas.renderer.domElement );
        canvas.camera.position.set( .25, .25, .25 );
        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;
        controls.maxPolarAngle = Math.PI/3;
        controls.update();
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

    loadModel(model) {
        return new Promise(function(resolve, reject) {
            let loader = new THREE.GLTFLoader();

            loader.load(model, function(gltf) {
                this.scene.add(gltf.scene);
                resolve('Success');
            }.bind(this));
        }.bind(this));
    }

    createCube() {
        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );
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

    resizeCanvas() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    enableShadow() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.size = 1024;
    }

    render(target) {
        let animate = function () {
            requestAnimationFrame( animate );

            if (target === 'composer') {
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }.bind(this);

        animate();
    }

    createComposer() {
        this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
        this.composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera));
    }

    setBloomEffect() {
        const effectPass = new POSTPROCESSING.EffectPass(this.camera, new POSTPROCESSING.BloomEffect());
        effectPass.renderToScreen = true;
        this.composer.addPass(effectPass);
    }

    setNoiseEffect() {
        const effectPass = new POSTPROCESSING.EffectPass(this.camera, new POSTPROCESSING.NoiseEffect());
        effectPass.renderToScreen = true;
        this.composer.addPass(effectPass);
    }
}