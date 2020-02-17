const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 90);
canvas.setToneMapping();
canvas.setBackgroundGradient('#00051a', '#0a0001');

// camera
canvas.camera.position.set(50, 50, 50);
canvas.camera.far = 2000;
canvas.camera.lookAt(0, 0, 0);
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// light
const light1 = canvas.createDirectionalLight(false, color="#f7b7f5", .2, -40, 5, 30);

// geometry
const sun = canvas.createCircle(72, 30, canvas.getMaterial({
    color: "#9cf7e7"
}));
sun.position.set(0,0,-210);

// models
canvas.loadModel('models/Drone2' +
    '/scene.gltf').then(function (obj) {
    obj.scene.scale.set(0.1, 0.1, 0.1);

    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0, 0, -5);

    // effects
    canvas.createGodRaysEffect(sun);
    canvas.saveEffects();

    // debug & render
    // canvas.enableDebugMode();
    canvas.render();
});

function getAllMeshes(scene) {
    let result = [];

    scene.children.forEach(function(item, i, array) {
        if (item.type === 'Mesh')
            result.push(item);
        else if (item.children.length)
            result.push(getAllMeshes(item));
    });

    if (Array.isArray(result))
        return result.flat();
}

