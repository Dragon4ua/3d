const canvas = new threeDimensions();

canvas.ambientLightSize = 0;
canvas.init();

canvas.setControls(minDistance=.25);
canvas.setBackgroundGradient('#ff7bd1', '#ff7f8c');
canvas.setPointLight();
canvas.enableShadow();

canvas.renderer.toneMapping = THREE.ACESFilmicToneMapping;
canvas.renderer.toneMappingExposure = .9;

var geoFloor = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
var matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0, metalness: 0 } );
var mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
mshStdFloor.position.y = 0.001;
mshStdFloor.rotation.x = -Math.PI / 2;
mshStdFloor.receiveShadow = true;
canvas.scene.add( mshStdFloor );



canvas.loadModel('models/donut.gltf').then(function() {
    canvas.render();

    let donutObject = canvas.scene.getObjectByName('Donut');
    donutObject.castShadow = true;
});