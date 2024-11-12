import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 50;

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10,3,16,100);

const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount *3);

for(let i = 0; i < particlesCount*3; i++){
    // posArray[i] = Math.random()
    posArray[i] = (Math.random() - 0.5) * 5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));


const texture = new THREE.TextureLoader().load('textures/grasslight-big.jpg');
const material = new THREE.PointsMaterial({map: texture, size: 0.005});

const particlesMaterial = new THREE.PointsMaterial({ 
    size: 0.005,
    color: 'red'
});

const torus = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(torus,particlesMesh);
torus.position.z = -55;
torus.position.x = -10;

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;

    camera.position.z = t * 0.1;
    camera.position.x = t * 0.01;
}

document.body.onscroll = moveCamera;

moveCamera();

function animate(){
    requestAnimationFrame(animate);

    torus.rotation.z += 0.01;

    renderer.render(scene, camera)
}
//mouse
document.addEventListener('mousemove', animateParticles);
let mouseX = 0; 
let mouseY = 0; 

function animateParticles(event){
    mouseY = event.clientY;
    mouseX = event.clientX;
}

const tick =() => {
    const elapsedTime = clock.getElapsedTime();

   

    toros.rotation.y = .5 


    particlesMesh.rotation.y = -.1 * elapsedTime

    if(mouseX > 0){
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008)
    particlesMesh.rotation.y = mouseY * (elapsedTime * 0.00008)
    }
    renderer.render(scene,camera)

    window.requestAnimationFrame(tick);
}


renderer.setClearColor(new THREE.Color('#21282a'),1);

animate();