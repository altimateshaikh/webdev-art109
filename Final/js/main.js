// Import Three.js if you're using modules
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Replace the single ripple variables with an array of ripples
let ripples = [];  // Will store objects containing position and time for each ripple

// Modify sphere creation
const geometry = new THREE.SphereGeometry(1, 64, 64); // Increased segments for smoother waves
const originalVertices = Array.from(geometry.attributes.position.array); // Initialize originalVertices
const material = new THREE.MeshPhongMaterial({ 
    color: 0x9c1330,
    shininess: 100,
    specular: 0x444444 
});
const sphere = new THREE.Mesh(geometry, material);

// Update the click event listener
renderer.domElement.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphere);
    
    if (intersects.length > 0) {
        ripples.push({
            position: intersects[0].point.clone(),
            time: 0
        });
    }
});

scene.add(sphere);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;

// Update the animation function
function animate() {
    requestAnimationFrame(animate);
    
    if (ripples.length > 0) {
        const positions = geometry.attributes.position.array;
        
        // Reset positions to original state
        for (let i = 0; i < positions.length; i++) {
            positions[i] = originalVertices[i];
        }
        
        // Apply all ripples
        for (let i = 0; i < positions.length; i += 3) {
            const vertex = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            
            // Calculate combined wave effect
            const direction = vertex.clone().normalize();
            let totalWave = 0;
            
            ripples.forEach(ripple => {
                const distance = ripple.position.distanceTo(vertex);
                const wave = Math.sin(distance * 12 - ripple.time) * 0.08;
                // Reduced decay rates for longer-lasting waves that travel further
                const normalizedWave = wave * Math.exp(-distance * 0.8) * Math.exp(-ripple.time * 0.2);
                
                // Add waves directly instead of using vectors for more pronounced interference
                totalWave += normalizedWave;
            });
            
            // Apply the combined wave effect
            positions[i] = originalVertices[i] + direction.x * totalWave;
            positions[i + 1] = originalVertices[i + 1] + direction.y * totalWave;
            positions[i + 2] = originalVertices[i + 2] + direction.z * totalWave;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        // Update ripple times and remove completed ripples
        ripples.forEach(ripple => ripple.time += 0.1);
        // Increased duration for longer-lasting ripples
        ripples = ripples.filter(ripple => ripple.time <= 15);
    }
    
    controls.update();
    renderer.render(scene, camera);
}
animate();
