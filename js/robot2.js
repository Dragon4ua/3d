const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(minDistance = .25, 90);
canvas.setToneMapping();
canvas.setBackgroundGradient('#c5e4ee', '#c5e4ee');

// camera
canvas.camera.position.set(0, 15, 10);
canvas.camera.far = 2000;
canvas.controls.target = new THREE.Vector3(0,15,0);
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// light
const light1 = canvas.createDirectionalLight(false, color="#fff", 4, 0, 10, 10, 160);
light1.target.position.set(0, 15, 0);

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
    robot.castShadow = true;

    console.log(robot);
    console.log(robot.material.color);

    const skeletonHelper = new THREE.SkeletonHelper(bones);
    canvas.scene.add(skeletonHelper);

    const headBone = bones.getObjectByName("mixamorigHead_05");
    console.log(headBone);

    console.log(skeletonHelper);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersected = [];

    function onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    // effects
    // canvas.createGodRaysEffect(sun);
    // canvas.saveEffects();

    // animation
    canvas.animation = function () {
        pivot.rotation.y = pivot.rotation.y + .01;

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, canvas.camera );

        // calculate objects intersecting the picking ray
        let intersects = raycaster.intersectObjects( root.children );

        console.log(intersects);
        console.log(intersects.length);

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersected.includes(intersects[i].object))
                    return;

                if (intersected.length && (!intersected.includes(intersects[i].object))) {
                    intersects[i].object.material.color.set(0xffffff);
                    intersected = false;
                    return;
                }

                intersects[i].object.material.color.set(0xff0000);
                intersected.push(intersects[i].object);
            }
        }
    };

    window.addEventListener( 'mousemove', onMouseMove, false );

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