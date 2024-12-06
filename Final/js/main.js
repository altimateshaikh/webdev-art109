// Import Three.js if you're using modules
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add event listener for window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
    camera.updateProjectionMatrix(); // Update the camera projection matrix
    renderer.setSize(window.innerWidth, window.innerHeight); // Update renderer size
});

// Replace the single ripple variables with an array of ripples
let ripples = [];  // Will store objects containing position and time for each ripple

// Create a sphere for the ripple effect
const geometry = new THREE.SphereGeometry(1, 64, 64); // Increased segments for smoother waves
const originalVertices = Array.from(geometry.attributes.position.array); // Initialize originalVertices
const material = new THREE.MeshPhongMaterial({ 
    color: 0xA3C1E0,
    shininess: 300,
    specular: 0xFFFFFF 
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere); // Add the original sphere to the scene

// Update the click event listener for the original sphere (button 1)
renderer.domElement.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

   
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(sphere);
    console.log("Creating throwable sphere at:", mouseX, mouseY);
    
    if (intersects.length > 0) {
        ripples.push({
            position: intersects[0].point.clone(),
            time: 0
        });
    }
});

// Update the click event listener for Button 1
document.querySelector('.round-button.button1').addEventListener('click', () => {
    // Switch back to the original sphere
    isThrowable = false;
    if (throwableSphere) {
        scene.remove(throwableSphere); // Remove the throwable sphere
        throwableSphere = null; // Clear the reference
    }
    
    // Ensure the original sphere is added to the scene
    if (!scene.children.includes(sphere)) {
        scene.add(sphere); // Add the original sphere to the scene
    }
});

// Update the click event listener for Button 2
document.querySelector('.round-button.button2').addEventListener('click', (event) => {
    // Get mouse position relative to the canvas
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Switch to throwable object
    isThrowable = true;
    if (sphere) {
        scene.remove(sphere); // Remove the original sphere
    }
    createThrowableSphere(mouseX, mouseY); // Create the throwable sphere at mouse position
});

scene.add(sphere);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Add OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Add smooth damping effect
// controls.dampingFactor = 0.05;

let throwableSphere; // Variable for the throwable sphere
let isThrowable = false; // Flag to check if the object is throwable

// Declare variables at the top of your file
let isDragging = false; // Flag to check if the ball is being dragged
let initialMousePosition = new THREE.Vector2(); // Store initial mouse position
let finalMousePosition = new THREE.Vector2(); // Store final mouse position
let velocity = new THREE.Vector3(); // Velocity of the ball

let throwableSphereColor; // Variable to store the color of the throwable sphere

// Function to create a throwable sphere
function createThrowableSphere(mouseX, mouseY) {
    if (!throwableSphere) { // Only create if it doesn't exist
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xA3C1E0,
            shininess: 300,
            specular: 0xFFFFFF 
        });
        throwableSphere = new THREE.Mesh(geometry, material);

        // Set position based on mouse coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (mouseX / window.innerWidth) * 2 - 1;
        mouse.y = -(mouseY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Intersect with the ground plane
        const intersects = raycaster.intersectObject(ground); 

        if (intersects.length > 0) {
            throwableSphere.position.copy(intersects[0].point); // Set position to intersection point
        } else {
            throwableSphere.position.set(0, 0, 0); // Default position if no intersection
        }

        scene.add(throwableSphere); // Add to the scene
    }
}

// Mouse down event
renderer.domElement.addEventListener('mousedown', (event) => {
    event.preventDefault(); // Prevent default behavior
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera, 50);

    // Check for dragging the throwable sphere only
    if (throwableSphere) {
        const intersects = raycaster.intersectObject(throwableSphere); // Intersect with the throwable sphere
        if (intersects.length > 0) {
            isDragging = true; // Start dragging the throwable sphere
            initialMousePosition.set(event.clientX, event.clientY); // Store initial mouse position
        }
    }
});

// Mouse move event
renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Update the position of the throwable sphere if it's being dragged
        if (throwableSphere) {
            const intersects = raycaster.intersectObject(ground); // Intersect with the ground plane
            if (intersects.length > 0) {
                // Set position to intersection point
                throwableSphere.position.copy(intersects[0].point); 
                throwableSphere.position.z = 0; // Keep Z position constant (disable Z movement)

                // Calculate velocity based on mouse movement
                finalMousePosition.set(event.clientX, event.clientY);
                velocity.set(
                    (finalMousePosition.x - initialMousePosition.x) * -0.01, // Adjusted scale for sensitivity
                    (finalMousePosition.y - initialMousePosition.y) * -0.01,
                    0 // Keep Z velocity constant
                );
            }
        }
    }
});

// Mouse up event
renderer.domElement.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false; // Stop dragging the ball
        // Apply velocity to the throwable sphere
        throwableSphere.position.add(velocity); // Move the sphere based on calculated velocity
        velocity.set(0, 0, 0); // Reset velocity after applying
    }
});

// Ensure mouseup is also captured when the mouse leaves the canvas
renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false; // Stop dragging if the mouse leaves the canvas
});

// Create a ground plane for the sphere to interact with
const groundGeometry = new THREE.PlaneGeometry(100, 100); // Adjust size as needed
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide, transparent: true, opacity: 0 }); // Make it transparent
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
ground.position.y = -0.095; // Position the ground at the bottom of the screen
scene.add(ground); // Add the ground to the scene

// Create a visible boundary for the throwable sphere
const boundaryGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, 1); // Adjust size as needed
const boundaryMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color for visibility
const boundary = new THREE.LineSegments(new THREE.EdgesGeometry(boundaryGeometry), boundaryMaterial);
boundary.position.z = -0.95; // Position it slightly behind the sphere
scene.add(boundary); // Add the boundary to the scene

// Update the animation function to handle the throwable sphere
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
                const wave = Math.sin(distance * 12 - ripple.time) * 0.2;
                // Reduced decay rates for longer-lasting waves that travel further
                const normalizedWave = wave * Math.exp(-distance * 0.9) * Math.exp(-ripple.time * 0.2);
                
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
    
    // Update position of the throwable sphere if it exists
    if (throwableSphere) {
        // Apply velocity to position
        throwableSphere.position.add(velocity); 

        // Check for wall collisions and bounce
        if (throwableSphere.position.x > window.innerWidth / 2 || throwableSphere.position.x < -window.innerWidth / 2) {
            velocity.x = -velocity.x; // Reverse X velocity
            throwableSphere.position.x = Math.max(Math.min(throwableSphere.position.x, window.innerWidth / 2), -window.innerWidth / 2); // Clamp position
        }
        if (throwableSphere.position.y > window.innerHeight / 2 || throwableSphere.position.y < -window.innerHeight / 2) {
            velocity.y = -velocity.y; // Reverse Y velocity
            throwableSphere.position.y = Math.max(Math.min(throwableSphere.position.y, window.innerHeight / 2), -window.innerHeight / 2); // Clamp position
        }

        // Reset velocity if the sphere falls below a certain height
        if (throwableSphere.position.y < 0) {
            throwableSphere.position.set(0, 0, 0); // Reset position
            velocity.set(0, 0, 0); // Reset velocity
        }
    }
    
    // controls.update(); // Commenting this out as well
    renderer.render(scene, camera);
}
animate();

// Function to generate a random pastel color
function getRandomPastelColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${Math.floor(r + 127)}, ${Math.floor(g + 127)}, ${Math.floor(b + 127)})`; // Ensures pastel colors
}

// Update the click event listener for Button 3
document.querySelector('.round-button.button3').addEventListener('click', () => {
    const pastelColor = getRandomPastelColor(); // Get a random pastel color

    // Apply the pastel color to both the original sphere (button 1) and the throwable sphere (button 2)
    if (sphere) {
        sphere.material.color.set(pastelColor); // Set color for button 1 ball
    }

    // Store the color for the throwable sphere
    throwableSphereColor = pastelColor; // Store the color for later use
    if (throwableSphere) {
        throwableSphere.material.color.set(throwableSphereColor); // Set color for button 2 ball
    }
});
