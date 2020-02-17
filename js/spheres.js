const canvas = new threeDimensions();

// actions
canvas.init();
canvas.enableShadow();

// environment
canvas.createControls(undefined, 90);
canvas.setBackgroundGradient("#000", "#1a1a1a");

// camera
canvas.camera.position.set(4, 90, 0);
canvas.camera.lookAt(0,0,0);

// light
const light1 = canvas.createPointLight(undefined, 5);
const light2 = canvas.createAmbientLight("#f7f7f7", .5);

// geometry
// -
const floor = canvas.createFloor(100, 100, canvas.getMaterial({
    color: "#1a1a1a",
    roughness: 0,
    metalness: 0,
    transparent: true,
    opacity: 1
}));
floor.position.y = -1;

// -
const sunPivot = new THREE.Object3D();
const sun = canvas.getSphere(1, 8, canvas.getMaterial({
    color: "#fff"
}));
sun.position.set(16, 2, 0);
sunPivot.add(sun);

light1.position.set(16, 2, 0);
sunPivot.add(light1);

canvas.scene.add(sunPivot);

//-
createBarriers(16, 16, 2);

// effects
canvas.createGodRaysEffect(sun);
// canvas.createBokehEffect();
canvas.saveEffects();

// animation
let frame = 0,
    cycle = 1;

canvas.animation = function () {
    sunPivot.rotation.y += .02 * cycle;
    sun.scale.setZ(1 + (cycle * .05));

    let R = 255,
        G = (255 - cycle * 5) > 0 ? (255 - cycle * 5) : 0,
        B = (255 - cycle * 5) > 0 ? (255 - cycle * 5) : 0;
    sun.material.color.setHex( rgbToHex(R, G, B) );
    light1.color.setHex( rgbToHex(R, G, B) );

    frame += 1;

    if (frame > 30) {
        cycle += 1;
        frame = 0;
    }
};

// debug & render
// canvas.enableDebugMode();
canvas.render();

function createBarriers(num, x, y) {
    for (let i = 0; i < num; i++) {
        let barrierPivot = new THREE.Object3D(),
            barrier = canvas.getTorus(2, 1, 12, 36, canvas.getMaterial({
                color: "#0d0d0d",
                roughness: 0,
                metalness: 0
            }));

        barrier.position.set(x, y, 0);
        barrierPivot.add(barrier);
        barrierPivot.rotation.y += 2 * Math.PI / num * (num - i);
        canvas.scene.add(barrierPivot);
    }
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}