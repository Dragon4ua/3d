const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 90);
canvas.setToneMapping();
canvas.setBackgroundGradient('#000', '#000');

// camera
const target = new THREE.Vector3(0,2,0);
canvas.camera.position.set(0, 0, 10);
canvas.camera.far = 2000;
canvas.controls.target = target;
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// light
const light1 = canvas.createDirectionalLight(false, color="#fff", 4, 0, 10, 10, 160);
light1.target.position = target.position;

const pivot = new THREE.Object3D();
pivot.position = target.position;
pivot.add(light1);

canvas.scene.add(pivot);

// geometry
// const floor = canvas.createFloor(300, 300, canvas.getMaterial({color: '#fff', roughness: 0.8, side: THREE.DoubleSide}));
//
// floor.rotation.x = Math.PI;
// floor.position.set(0, 0, -10);
// const sun = canvas.createCircle(72, 30, canvas.getMaterial({
//     color: "#9cf7e7"
// }));
// sun.position.set(0,0,-210);

// models
canvas.loadModel('models/Robot3/scene.gltf').then(function (obj) {
    obj.scene.scale.set(0.1, 0.1, 0.1);

    const item = obj.scene.getObjectByName("Holo_Finalobjcleanermaterialmergergles");

    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0, 0, 0);

    console.log(item);

    for (let object of getAllObjects(item)) {
        object.material.type = "MeshStandardMaterial";
        object.roughness = 0;
    }

    // effects
    // canvas.createGodRaysEffect(sun);
    // canvas.saveEffects();

    // animation
    canvas.animation = function () {
        pivot.rotation.y = pivot.rotation.y + .01
    };

    // debug & render
    canvas.enableDebugMode();
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

function getAllObjects(scene) {
    let result = [];

    scene.children.forEach(function(item, i, array) {
        if (item.type === 'Object3D')
            result.push(item);
        else if (item.children.length)
            result.push(getAllObjects(item));
    });

    if (Array.isArray(result))
        return result.flat();
}

