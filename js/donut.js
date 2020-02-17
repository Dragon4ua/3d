const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25);
canvas.setToneMapping();
canvas.setBackgroundGradient('#ff7bd1', '#ff7f8c');

// camera
canvas.camera.position.set(5, 5, 5);
canvas.camera.lookAt(0, 0, 0);

// light
canvas.createDirectionalLight(undefined, color = "#f7f7f7", intensity = 1, x = 8, y = 4, z = 0, 40);
// canvas.createAmbientLight("#ff7bd1", 0.3);

// geometry
// -
canvas.createFloor(200, 200);

// -
canvas.loadModel('models/donut.gltf').then(function () {
    const donut = canvas.scene.getObjectByName('Donut');
    const icing = canvas.scene.getObjectByName('Icing');

    icing.castShadow = true;

    donut.scale.set(40, 40, 40);
    donut.position.y = 1;
    donut.castShadow = true;
    donut.receiveShadow = true;

    // effects
    // canvas.createBokehEffect(5);
    // canvas.createBloomEffect();
    // canvas.saveEffects();

    // debug & render
    // canvas.enableDebugMode();
    canvas.render();
});

