const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance=.25, 100);
canvas.setToneMapping();
canvas.setBackgroundGradient('#ecedd4', '#cfe6d1');

// camera
canvas.camera.position.set( 30, 30, 30 );
canvas.camera.lookAt(0,0,0);
canvas.controls.update();

// light
const light1 = canvas.createSpotLight(color="#f7ece9", 0, 45, 24);
light1.target.position = new THREE.Object3D(0, 25, 0);

// textures
const marbleTexture = canvas.loadTexture('/models/Statue/textures/StoneMarbleCalacatta004_COL_1K.jpg');
const marbleGlossTexture = canvas.loadTexture('/models/Statue/textures/StoneMarbleCalacatta004_GLOSS_1K');
const marbleNormalsTexture = canvas.loadTexture('/models/Statue/textures/StoneMarbleCalacatta004_NRM_1K');

// models
canvas.loadModel('models/Statue/scene.gltf').then(function() {
    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0,0,-10);

    const object = canvas.scene.getObjectByName("cherubin_tortue_-_LowPolyobjcleanermaterialmergergles");

    for (let item of object.children) {
        item.material = canvas.getMaterial({
            roughness: .6,
            metallnes: 0,
            map: marbleTexture,
            envMap: marbleTexture
        });
    }

    // debug & render
    canvas.enableDebugMode();
    canvas.render();
});

