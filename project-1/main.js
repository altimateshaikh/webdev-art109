// document.addEventListener("DOMContentLoaded",function(){})
//     document.getElementById("runaway-btn").addEventListener("mouseover", function(){
//         console.log("change")
//         document.getElementById("runaway-btn").innerHTML = "you realy dont have to"
//     })
//     const button = document.getElementById("runaway-btn");
//     const safeDistance = 50;

//     const moveButton = (element, top, left) => {
//         element.style.top = `${top}px`;
//         element.style.left = `${left}px`
//     }

//     ["mouseover", "click"].forEach(function (el) {
//         button.addEventListener(el, function(){
//             const top = getRandomNumber(window.innerHeight - this.offsetHeight);
//             const left = getRandomNumber(window.innerWidth - this.offsetWidth);
            
//             console.log(top, left);
//             moveButton(this,top,left);
//         });
//     });

//     const getRandomNumber = (num) => {
//     return Math.floor(Math.random() * (num + 1));
// };




const button = document.getElementById("runaway-btn");
const refreshCountDisplay = document.getElementById('hover-count');
const hoverCountDisplay = document.getElementById('hover-count');
const closeTabButton = document.getElementById("close-tab-btn");

// Show the close tab button when hovering over the main button
closeTabButton.addEventListener("mouseenter", () => {
    closeTabButton.style.opacity = "1"; // Show the button
});

// Hide the close tab button when the mouse leaves the main button
closeTabButton.addEventListener("mouseleave", () => {
    closeTabButton.style.opacity = "0"; // Hide the button
});

closeTabButton.style.opacity = '0';

// Add click event to close the tab
closeTabButton.addEventListener("click", () => {
    window.close(); // This will close the current tab
});


const words = [
  "Like",
  "get a million dollars",
  "world peace",
  "subscribe",
  "Touch grass",
  "win a hundred dollars?",
  "you wont believe what this celeberty did?!!",
  "comment",
  "your still here",
  "caught me in a corner",
  "refresh page",
  "how many times have you tried to click me?",
  "lol",
  "I lead no where",
  "you shold stop"
];

let currentIndex = 0; // To keep track of the current word index

if (localStorage.getItem('hoverCount')) {
  localStorage.setItem('hoverCount', 0);
} 

// Update hover count display
const updateHoverCountDisplay = () => {
  hoverCountDisplay.innerHTML = `hovered over ${localStorage.getItem('hoverCount')} times`;
};

updateHoverCountDisplay();

// Display the hover count on the page
refreshCountDisplay.innerHTML = ` hovered over ${localStorage.getItem('hoverCount')} times`;

const getRandomIndex = (max) => Math.floor(Math.random() * max);


// Function to get a random color
const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  
  let r, g, b;

  do {
      r = randomColor();
      g = randomColor();
      b = randomColor();
  } while (
      (r + g + b) / 3 < 100 || // Avoid too dark colors
      (r + g + b) / 3 > 200   // Avoid too light colors
  );

  return `rgb(${r}, ${g}, ${b})`;
};

// Mouse over event to change button text
button.addEventListener("mouseover", function() {
    // Change the button text to the current word
    const randomIndex = getRandomIndex(words.length);
    button.innerHTML = words[randomIndex];

    button.style.backgroundColor = getRandomColor();

    // Update and display hover count
     const newHoverCount = Number(localStorage.getItem('hoverCount')) + 1;
     localStorage.setItem('hoverCount', newHoverCount);
     updateHoverCountDisplay();

});

// Initial update for hover count display
updateHoverCountDisplay();

// Show hover count display when hovered over
hoverCountDisplay.addEventListener("mouseenter", () => {
  hoverCountDisplay.style.opacity = '1';
});

// Hide hover count display when mouse leaves the counter
hoverCountDisplay.addEventListener("mouseleave", () => {
  hoverCountDisplay.style.opacity = '0';
});

hoverCountDisplay.style.opacity = '0';

const safeDistance = 300; // Minimum distance (in pixels) to keep between the mouse and the button

// Function to calculate the distance between two points (mouse and button center)
const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Mouse move event to track proximity to the button
document.addEventListener("mousemove", function (event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const buttonRect = button.getBoundingClientRect();
  const buttonX = buttonRect.left + buttonRect.width / 2;
  const buttonY = buttonRect.top + buttonRect.height / 2;

  const distance = calculateDistance(mouseX, mouseY, buttonX, buttonY);

  // If the mouse is within the 'safeDistance', move the button away from the mouse
  if (distance < safeDistance) {
    const deltaX = buttonX - mouseX; // Calculate the horizontal distance between the button and the mouse
    const deltaY = buttonY - mouseY; // Calculate the vertical distance between the button and the mouse

    // Move the button in the opposite direction from the mouse
    let moveTop = buttonRect.top + 2 * deltaY;
    let moveLeft = buttonRect.left + 2 * deltaX;

    if (
        moveTop <= 0  ||moveTop >= window.innerHeight - button.offsetHeight || // Touching top/bottom
        moveLeft <= 0 || moveLeft >= window.innerWidth - button.offsetWidth // Touching left/right
      ) {
        // Teleport to center if touching any border
        console.log("touching boarders");
        moveTop = (window.innerHeight - button.offsetHeight) / 2;
        moveLeft = (window.innerWidth - button.offsetWidth) / 2;
      }

    // Ensure the button stays within the window bounds
    const boundedTop = Math.max(0, Math.min(window.innerHeight - button.offsetHeight, moveTop));
    const boundedLeft = Math.max(0, Math.min(window.innerWidth - button.offsetWidth, moveLeft));

    button.style.top = `${boundedTop}px`;
    button.style.left = `${boundedLeft}px`;
  }
});
