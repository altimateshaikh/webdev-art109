import * as THREE from 'three';
// import Stats from 'three/addons/libs/stats.module.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from 'three/addons/shaders/ToonShader.js';

let container;
// , stats;
let camera, scene, renderer;
let materials, current_material;
let light, pointLight, ambientLight;
let effect, resolution;
// let effectController;
let time = 0;
const clock = new THREE.Clock();

init();

function init() {
    container = document.getElementById('container');

    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-500, 500, 1500);

    // SCENE
    scene = new THREE.Scene();
    scene.background = null;

    // LIGHTS
    light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    pointLight = new THREE.PointLight(0xff7c00, 5, 0, 0);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    ambientLight = new THREE.AmbientLight(0xFFFF00, 0.5);
    scene.add(ambientLight);

    // MATERIALS
    materials = generateMaterials();
    current_material = 'shiny';

    // MARCHING CUBES
    resolution = 28;
    effect = new MarchingCubes(resolution, materials[current_material], true, true, 100000);
    effect.position.set(0, 0, 0);
    effect.scale.set(700, 700, 700);
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add(effect);

    // RENDERER
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 5000;

    // // STATS
    // stats = new Stats();
    // container.appendChild(stats.dom);

    // // GUI
    // setupGui();

    // EVENTS
    window.addEventListener('resize', onWindowResize);
}

// Resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Generate materials with equirectangular environment map
function generateMaterials() {
    // Load equirectangular texture
    const textureLoader = new THREE.TextureLoader();
    const envTexture = textureLoader.load('images-resume/finalimg.png', function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        console.log("Equirectangular texture loaded:", texture);
    });

    // Toons
    const toonMaterial1 = createShaderMaterial(ToonShader1, light, ambientLight);
    const toonMaterial2 = createShaderMaterial(ToonShader2, light, ambientLight);
    const hatchingMaterial = createShaderMaterial(ToonShaderHatching, light, ambientLight);
    const dottedMaterial = createShaderMaterial(ToonShaderDotted, light, ambientLight);

    const texture = new THREE.TextureLoader().load('images-resume/uv_grid_opengl.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const materials = {
        'shiny': new THREE.MeshStandardMaterial({
            color: 0x66ff00,
            envMap: envTexture, // Use equirectangular environment map
            roughness: 0.1,
            metalness: 1.0,
            // opacity: 0.5,
            // transparent: true
        }),
        'chrome': new THREE.MeshLambertMaterial({
            color: 0xffffff,
            envMap: envTexture // Use equirectangular environment map
        }),
        'liquid': new THREE.MeshLambertMaterial({
            color: 0xffffff,
            envMap: envTexture,
            refractionRatio: 0.85
        }),
        'matte': new THREE.MeshPhongMaterial({
            specular: 0x494949,
            shininess: 1
        }),
        'flat': new THREE.MeshLambertMaterial({ /* flat shading not enabled in the original code */ }),
        'textured': new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x111111,
            shininess: 1,
            map: texture
        }),
        'colors': new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 2,
            vertexColors: true
        }),
        'multiColors': new THREE.MeshPhongMaterial({
            shininess: 2,
            vertexColors: true
        }),
        'plastic': new THREE.MeshPhongMaterial({
            specular: 0xc1c1c1,
            shininess: 250
        }),
        'toon1': toonMaterial1,
        'toon2': toonMaterial2,
        'hatching': hatchingMaterial,
        'dotted': dottedMaterial
    };

    return materials;
}

function createShaderMaterial(shader, light, ambientLight) {
    const u = THREE.UniformsUtils.clone(shader.uniforms);
    const vs = shader.vertexShader;
    const fs = shader.fragmentShader;

    const material = new THREE.ShaderMaterial({
        uniforms: u,
        vertexShader: vs,
        fragmentShader: fs
    });

    material.uniforms['uDirLightPos'].value = light.position;
    material.uniforms['uDirLightColor'].value = light.color;
    material.uniforms['uAmbientLightColor'].value = ambientLight.color;

    return material;
}

// Setup GUI for material change and simulation parameters
// function setupGui() {
//     const createHandler = function (id) {
//         return function () {
//             current_material = id;
//             effect.material = materials[id];
//             effect.enableUvs = (current_material === 'textured') ? true : false;
//             effect.enableColors = (current_material === 'colors' || current_material === 'multiColors') ? true : false;
//         };
//     };

//     effectController = {
//         material: 'shiny',
//         speed: 1.75,
//         numBlobs: 6,
//         resolution: 50,
//         isolation: 33,
//         floor: false,
//         wallx: false,
//         wallz: false,
//         dummy: function () { }
//     };

//     const gui = new GUI();

//     // Material (type)
//     let h = gui.addFolder('Materials');
//     for (const m in materials) {
//         effectController[m] = createHandler(m);
//         h.add(effectController, m).name(m);
//     }

//     // Simulation
//     h = gui.addFolder('Simulation');
//     h.add(effectController, 'speed', 0.1, 8.0, 0.05);
//     h.add(effectController, 'numBlobs', 1, 50, 1);
//     h.add(effectController, 'resolution', 14, 100, 1);
//     h.add(effectController, 'isolation', 10, 300, 1);
//     h.add(effectController, 'floor');
//     h.add(effectController, 'wallx');
//     h.add(effectController, 'wallz');
// }

// Update marching cubes
function updateCubes(object, time, numblobs, floor, wallx, wallz) {
    object.reset();

    const widthFactor = window.innerWidth / 800;  // Adjust based on desired size
    const heightFactor = window.innerHeight / 600;


    const rainbow = [
        new THREE.Color(0xff0000),
        new THREE.Color(0xffbb00),
        new THREE.Color(0xffff00),
        new THREE.Color(0x00ff00),
        new THREE.Color(0x0000ff),
        new THREE.Color(0x9400bd),
        new THREE.Color(0xc800eb)
    ];
    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {
        const ballx = Math.tan(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * -widthFactor;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * heightFactor ; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.2 * widthFactor + 0.5;

        if (current_material === 'multiColors') {
            object.addBall(ballx, bally, ballz, strength, subtract, rainbow[i % 7]);
        } else {
            object.addBall(ballx, bally, ballz, strength, subtract);
        }
    }

    if (floor) object.addPlaneY(2, 100);
    if (wallz) object.addPlaneZ(2, 12);
    if (wallx) object.addPlaneX(2, 100);

    object.update();
}

// Animation loop
function animate() {
    render();
    // stats.update();
}

// Render scene
function render() {
    const delta = clock.getDelta();
    time += delta * 1.75 * 0.5;
    // effectController.speed

    // marching cubes
    if (50 !== resolution) {
        resolution = 50;
        effect.init(Math.floor(resolution));
    }

  
        effect.isolation = 500;
    

    updateCubes(effect, time/3, 100, false, false, false);

    renderer.render(scene, camera);
}
