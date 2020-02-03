const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance=.25);
canvas.setToneMapping();
canvas.setBackgroundGradient('#ff7bd1', '#ff7f8c');

// camera
canvas.camera.position.set( 2.5, 2.5, 2.5 );
canvas.camera.lookAt(0,0,0);

// light
canvas.createAmbientLight(color="#f7f7f7", size=.1);
canvas.createPointLight(color="#f7f7f7", intensity=.3, x=.15, y=.25, z=0);

// geometry
// -
// const floor = canvas.createFloor();

// -
canvas.loadModel('models/donut.gltf').then(function() {
    canvas.model.scale.set(20, 20, 20);
    canvas.model.position.y = .1;
    canvas.model.castShadow = true;
    canvas.model.receiveShadow = true;

    // effects
    canvas.createBokehEffect(3);
    canvas.createBloomEffect();
    canvas.saveEffects();

    // debug & render
    // canvas.enableDebugMode();
    canvas.render();
});

