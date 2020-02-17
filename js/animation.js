const canvas = new threeDimensions();

// actions
canvas.init();

// environment
canvas.setBackgroundGradient("#1a1a1a", "#000");
canvas.createControls(2, 300);

// camera
canvas.camera.position.set(0, 0, 10);
canvas.camera.far = 2000;
canvas.camera.lookAt(0, 0, 0);
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// lights
canvas.createAmbientLight("#fff", 1);

// geometry
const circle = canvas.getCircle(1, 48, canvas.getMaterial({color: "#00fffe", side: THREE.DoubleSide}));
const sphere = canvas.createSphere(1, 48, canvas.getMaterial({color: "#fff"}));
sphere.position.y=10;

const items = placeRandomly(circle, 8);

canvas.animation = function() {
    for (let item of items) {
        item.position.z = item.position.z + 0.1;
        item.rotation.z = item.rotation.z + Math.random() / 10;
        item.rotation.x = item.rotation.x + Math.random() / 10;
    }
};

canvas.loadSVG('images/logo.svg').then(function() {
    canvas.render();
});

canvas.enableDebugMode();

function placeRandomly(item, number) {
    let items = [];

    for (let i = 0; i < number; i++) {
        let clonedItem = item.clone();

        canvas.scene.add(clonedItem);

        clonedItem.position.set(100 * (0.5 - Math.random()), 20 * (0.5 - Math.random()), -Math.random() * 100)

        items.push(clonedItem);
    }

    return items;
}