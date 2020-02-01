var container, controls;
var camera, scene, renderer;

init();
render();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-1.8, 0.6, 2.7);

    scene = new THREE.Scene();

    let channels = [255, 255, 255];
    let newTexture = generateGradientTexture('#0046f5', '#f700c4');

    new THREE.RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('textures/equirectangular/')
        .load('royal_esplanade_1k.hdr', function (texture) {

            var envMap = pmremGenerator.fromEquirectangular(texture).texture;

            var newMap = pmremGenerator.fromEquirectangular(newTexture).texture;

            console.log(pmremGenerator.fromEquirectangular(newTexture));

            scene.background = newMap;
            scene.environment = newMap;

            texture.dispose();
            pmremGenerator.dispose();

            render();

            var loader = new THREE.GLTFLoader().setPath( 'models/DamagedHelmet/gLTF/' );
            loader.load( 'DamagedHelmet.gltf', function ( gltf ) {
                scene.add( gltf.scene );
                render();
            } );
        });

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.update();

    function animate() {
        requestAnimationFrame( animate );

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function generateGradientTexture(color1, color2) {
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

function generateTexture(R, G, B) {
    let width = 4;
    let height = 4;

    let size = width * height;
    let data = new Uint8Array( 3 * size );

    console.log(data);

    let r = Math.floor( R );
    let g = Math.floor( G );
    let b = Math.floor( B );

    for ( let i = 0; i < size; i ++ ) {
        let stride = i * 3;

        data[ stride ] = r;
        data[ stride + 1 ] = g;
        data[ stride + 2 ] = b;

    }

    return new THREE.DataTexture( data, width, height, THREE.RGBFormat );
}

function render() {
    renderer.render(scene, camera);
}