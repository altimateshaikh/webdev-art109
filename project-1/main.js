// document.addEventListener("DOMContentLoaded",function(){})
    // document.getElementById("runaway-btn").addEventListener("mouseover", function(){
    //     console.log("change")
    //     document.getElementById("runaway-btn").innerHTML = "you realy dont have to"
    // })
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
