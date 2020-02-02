const canvas = new threeDimensions();

canvas.init();
canvas.setBackgroundGradient("#1a1a1a", "#000");
canvas.enableShadow();
canvas.setControls(2, 300);

canvas.camera.fov = 90;
canvas.camera.position.set(0,40,0);
canvas.camera.far = 1000;
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// canvas.createFloor(600, 600, '#1a1a1a');
canvas.setAmbientLight();

const sun = canvas.getSphere(3, 72, "#f1f1f1");

let pivotPoint = new THREE.Object3D();
canvas.scene.add(pivotPoint);

sun.position.set(30, 0, 0);

pivotPoint.add(sun);

let torus1 = canvas.createTorus(5, 3, 12, 108);
torus1.position.set(30, 0, 0);

let torus2 = canvas.createTorus(5, 3, 12, 108);
torus2.position.set(-30, 0, 0);

let torus3 = canvas.createTorus(5, 3, 12, 108);
torus3.position.set(0, 0, 30);
torus3.rotation.y=Math.PI / 2;

let torus4 = canvas.createTorus(5, 3, 12, 108);
torus4.position.set(0, 0, -30);
torus4.rotation.y=Math.PI / 2;

canvas.animation = function () {
    pivotPoint.rotation.y += .1;
};

canvas.setGodraysEffect(sun);

canvas.render();

// canvas.debugMode();