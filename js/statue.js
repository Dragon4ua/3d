const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance=.25, 100);
canvas.setToneMapping();
canvas.setBackgroundGradient('#ff7bd1', '#ff7f8c');

// camera
canvas.camera.position.set( 30, 30, 30 );
canvas.camera.lookAt(0,0,0);

// light
canvas.createAmbientLight(color="#f7f7f7", size=.1);
canvas.createPointLight(color="#f7f7f7", intensity=.3, x=.15, y=.25, z=0);

// geometry
// -
// const floor = canvas.createFloor();

// -
canvas.loadModel('models/Hercules/scene.gltf').then(function() {
    const object = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    object.position.set(0,0,0);

    // effects
    // canvas.createBokehEffect(3);
    // canvas.createBloomEffect();
    // canvas.saveEffects();

    // debug & render
    canvas.enableDebugMode();
    canvas.render();
});

