const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 120);
canvas.setToneMapping();
canvas.setBackgroundGradient('#00000d', '#040014');

// camera
const target = new THREE.Vector3(0,-5,0);
canvas.camera.position.set(100, 50, 100);
canvas.camera.far = 2000;
canvas.controls.target = target;
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// light
// const light1 = canvas.createDirectionalLight(false, color="#f7f3ff", .8, -40, 5, 30, 120);
// const light2 = canvas.createDirectionalLight(false, color="#838fff", .8, 40, 5, 30, 120);
const light3 = canvas.createSpotLight(color="#838fff", 36, 80, 25);
const pivot = new THREE.Object3D();
pivot.position = target.position;
pivot.add(light3);
canvas.scene.add(pivot);

// geometry
// const sun = canvas.createCircle(48, 30, canvas.getMaterial({
//     color: "#9cf7e7"
// }));
// sun.position.set(0,0,-210);

// models
canvas.loadModel('models/Drone3/scene.gltf').then(function (obj) {
    obj.scene.scale.set(0.05, 0.05, 0.05);

    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0, 0, 80);

    const drone = obj.scene.getObjectByName('Body');

    console.log(drone);
    console.log(getAllMeshes(drone));
    for (let mesh of getAllMeshes(drone)) {
        mesh.material.roughness = .2;
        mesh.material.metallnes = .8;
    }

    // Create an AnimationMixer, and get the list of AnimationClip instances
    const mixer = new THREE.AnimationMixer( drone );
    mixer.clipAction( obj.animations[0]).play();

    const clock = new THREE.Clock();

    // Update the mixer on each frame
    canvas.animation = function () {
        let delta = clock.getDelta();
        mixer.update( delta );
        canvas.controls.update( delta );

        pivot.rotation.y = pivot.rotation.y + .01
    };

    // effects
    // canvas.createGodRaysEffect(sun);
    // canvas.saveEffects();

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

