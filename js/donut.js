const canvas = new threeDimensions();

canvas.init();
canvas.camera.position.set( .25, .25, .25 );
canvas.enableShadow();

canvas.setControls(minDistance=.25);
canvas.setToneMapping();
canvas.setBackgroundGradient('#ff7bd1', '#ff7f8c');
canvas.setAmbientLight(color="#f7f7f7", size=.1);
canvas.setPointLight(color="#f7f7f7", intensity=.3, x=.15, y=.25, z=0);

canvas.createFloor();

canvas.loadModel('models/donut.gltf').then(function() {
    canvas.render();

    canvas.model.castShadow = true;
    canvas.model.receiveShadow = true;
});

// canvas.debugMode();