// Basic Three.JS scene from documentation, importing Three.JS through a CDN 
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
let scene, camera, renderer, icos, dog;
let sceneContainer = document.querySelector("#scene-container");
let actionPant, actionTail;
function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x15220);
    camera = new THREE.PerspectiveCamera(75,sceneContainer.clientWidth/ sceneContainer.clientHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);
    const light = new THREE.DirectionalLight(0xfff, 10);
    light.position.set(1,1,5);
    scene.add(light);


// ~~~~~~~~~~~~~~~~ Initiate add-ons ~~~~~~~~~~~~~~~~
    const controls = new OrbitControls(camera, renderer.domElement);
    
    const geometry = new THREE.IcosahedronGeometry(.5, 0);
    // const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const texture = new THREE.TextureLoader().load('textures/grasslight-big.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    icos = new THREE.Mesh(geometry, material);
    scene.add(icos);
    icos.position.x = 2;

    // icos = new THREE.mesh(geometry, material);
    // scene.add(icos);

// →→→→→→ Follow next steps in tutorial: // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    camera.position.z = 5;
}


//~~~~~~~Import Three.js (also linked to as import map in HTML)~~~~~~
import * as THREE from 'three';

// Import add-ons
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models
const loader = new GLTFLoader(); // to load 3d models
let mixer;
loader.load('dog_shiny.gltf', function (gltf){
    dog = gltf.scene;
    scene.add(dog);
    dog.scale.set(2,2,2);
    dog.position.y = -2

    mixer = new THREE.AnimationMixer(dog);
    const clips = gltf.animations;

    const clipPant = THREE.AnimationClip.findByName(clips, 'pant');
    actionPant = mixer.clipAction(clipPant);
    //actionPant.play();

    const clipTail = THREE.AnimationClip.findByName(clips, 'tail');
    actionTail = mixer.clipAction(clipTail);
    //actionTail.play();

})

// ~~~~~~~~~~~~~~~~Event Listiners~~~~~~~~~~~~~~~~~~~~~
let mouseIsDown = false

document.querySelector("body").addEventListener("mousedown", () => {
     actionPant.play();
     actionPant.paused = false;
     mouseIsDown = true;
     console.log("mousedown")
})

document.querySelector("body").addEventListener("mouseup", () => {
    actionTail.play();
    actionPant.paused = true;
    mouseIsDown = true;
    console.log("mouseup");
})

document.querySelector("body").addEventListener("mousemove", () => {
    if (mouseIsDown) {
    console.log("mousemove");
    icos.rotation.x += .5;
    }
})



// ~~~~~~~~~~~~~~~~Create scene here~~~~~~~~~~~~~~~~

const clock = new THREE.Clock();
function animate(){
   requestAnimationFrame(animate);
    if(dog){
    // dog.rotation.x += 0.01;
    // dog.rotation.y += 0.01;
    dog.rotation.y = Math.sin(Date.now()/1000) * 2;
    }
    icos.rotation.x += 0.01;
    icos.rotation.y += 0.01;

    icos.position.x = Math.sin(Date.now()/1000) * 2;
    icos.position.y = Math.sin(Date.now()/2000) * 2;
    icos.position.z = Math.sin(Date.now()/3000) * 2;
    // console.log(icos.position.x);
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera); 
}

function onWindowResize(){
    camera.aspect = sceneContainer.clientWidth/ sceneContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);

}
window.addEventListener('resize', onWindowResize, false);
init();
animate();