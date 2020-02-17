const canvas = new threeDimensions();

canvas.init();
canvas.setBackgroundGradient("#1a1a1a", "#000");
canvas.enableShadow();
canvas.createControls(2, 300);

canvas.camera.fov = 90;
canvas.camera.position.set(20,20,20);
canvas.camera.far = 1000;
canvas.camera.updateProjectionMatrix();
canvas.controls.update();

// canvas.createFloor(600, 600, '#1a1a1a');
canvas.createAmbientLight();

const sun = canvas.createCircle(200, 36, canvas.getMaterial({color: "#f1f1f1"}));

sun.position.set(0, 20, -300);
sun.scale.setX(1.2);

let loader = new THREE.FontLoader();

loader.load( 'fonts/Montserrat_ExtraBold_Regular.json', function ( font ) {
    const A = createLetter(font, 'A');
    A.position.set(-100, -30, 0);

    const I = createLetter(font, 'I');
    I.position.set(-40, -30, 0);

    const Space = createLetter(font, '-');
    Space.position.set(-20, -30, 0);

    const Four = createLetter(font, '4');
    Four.position.set(0, -30, 0);

    const Zero = createLetter(font, '0');
    Zero.position.set(40, -30, 0);

    canvas.createGodRaysEffect(sun);
    canvas.saveEffects(sun);

    canvas.render();

    console.log(canvas.scene);

    // canvas.debugMode();
});

function createLetter(font, letter) {
    const geometry = new THREE.TextBufferGeometry(letter, {
        font: font,
        size: 60,
        height: 1,
        curveSegments: 30,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 2,
        bevelOffset: 0,
        bevelSegments: 30
    });

    // Create material with msdf shader from three-bmfont-text
    const material = new THREE.MeshPhysicalMaterial( {
        map: canvas.getGradientTexture("#000", "#1a1a1a"),
        color: 0x000000,
        metalness: 0,
        roughness: 1,
        opacity: 1,
        transparent: true,
        envMapIntensity: 5,
        premultipliedAlpha: true
        // TODO: Add custom blend mode that modulates background color by this materials color.
    } );

    // Create mesh of text
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    canvas.scene.add(mesh);

    return mesh;
}