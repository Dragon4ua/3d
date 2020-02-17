const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 90);
canvas.setToneMapping();
canvas.setBackgroundGradient('#f7d9ff', '#ffbdaf');

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
canvas.loadModel('models/Robot/scene.gltf').then(function (obj) {
    obj.scene.scale.set(0.1, 0.1, 0.1);

    const robot = obj.scene.getObjectByName('Armature');
    robot.position.y = 0;

    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0, 0, -5);

    // Create an AnimationMixer, and get the list of AnimationClip instances
    const mixer = new THREE.AnimationMixer( robot );
    mixer.clipAction( obj.animations[0]).play();

    const clock = new THREE.Clock();

    // Update the mixer on each frame
    canvas.animation = function () {
        let delta = clock.getDelta();
        mixer.update( delta );
        canvas.controls.update( delta );
    };

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

