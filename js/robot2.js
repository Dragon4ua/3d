const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 90);
canvas.setToneMapping();
canvas.setBackgroundColor('#000');

// camera
canvas.camera.position.set(0, 15, 10);
canvas.camera.far = 2000;
canvas.controls.target = new THREE.Vector3(0,15,0);
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

let vect = new THREE.Vector3();
let cameraPosition = new THREE.Vector3();

function onMouseMove() {
    vect.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );

    vect.unproject( canvas.camera );

    vect.sub( canvas.camera.position ).normalize();

    let distance = - canvas.camera.position.z / vect.z;

    cameraPosition.copy( canvas.camera.position ).add( vect.multiplyScalar( distance ) );

    cameraPosition.z = canvas.camera.position.z;
}

window.addEventListener('mousemove', onMouseMove);

// light
const light1 = canvas.createDirectionalLight(false, color="#ee9b5f", 3, 0, 10, -20, 160);
light1.target.position.set(0, 15, 0);

const light2 = canvas.createDirectionalLight(false, color="#C5E4EE", 1, 0, 10, 20, 160);
light2.target.position.set(0, 20, 0);

canvas.createAmbientLight("#fff", 0);

const pivot = new THREE.Object3D();
pivot.position.set(0,15,0);
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
canvas.loadModel('models/Robot2/scene.gltf').then(function (obj) {
    obj.scene.scale.set(0.1, 0.1, 0.1);

    const root = canvas.scene.getObjectByName('RootNode').children[0];

    root.remove(root.children[4]);
    root.remove(root.children[3]);
    root.remove(root.children[2]);
    root.remove(root.children[1]);

    const bones = root.children[0];

    for (let child of getAllChildren(bones, 'Object3D')) {
        child.parent.remove(child);
    }

    const correction = canvas.scene.getObjectByName('RootNode_(model_correction_matrix)');
    correction.position.set(0, 0, 0);

    const robot = root.children[1];
    robot.material.roughness = .8;
    robot.material.metallnes = .2;
    console.log(robot.material.emissive);
    console.log(robot.material);
    robot.material.emissive = new THREE.Color("#fff");
    robot.material.emissiveIntensity = 1;
    robot.castShadow = true;

    const robotEyes = canvas.createDirectionalLight(false, color="#fff", 0, 0, 10, 10, 160);
    const robotTarget = new THREE.Object3D();
    canvas.scene.add(robotTarget);

    // const skeletonHelper = new THREE.SkeletonHelper(bones);
    // canvas.scene.add(skeletonHelper);

    const headBone = bones.getObjectByName("mixamorigHead_05");
    headBone.parent.add(robotEyes);
    robotEyes.position.set(headBone.position.x, headBone.position.y, headBone.position.z);

    // effects
    // canvas.createGodRaysEffect(sun);
    // canvas.saveEffects();

    // animation
    canvas.animation = function () {
        pivot.rotation.y = pivot.rotation.y + .01;

        robotTarget.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

        if (robotTarget.position.x)
            robotEyes.target = robotTarget;
        else
            robotEyes.target = canvas.camera;

        headBone.rotation.x = robotEyes.shadow.camera.rotation.x + Math.PI;
        headBone.rotation.y = -robotEyes.shadow.camera.rotation.y;
        headBone.rotation.z = -robotEyes.shadow.camera.rotation.z + Math.PI;
    };

    // debug & render
    // canvas.enableDebugMode();
    canvas.render();
});

function getAllChildren(item, type="") {
    let results = [];

    item.traverse(function (object) {
        if (type)
            if (object.type === type) results.push(object);
    });

    return results;
}