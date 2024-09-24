// console.log("sup");


// let pageTitle = document.querySelector("#page-title")


// // title chances color after 3 seconds
// setTimeout(function(){
// pageTitle.style.color= "pink";
// } , 3000);
// // click event on header changes background color

// document.querySelector("header").onclick = function(){
//     //console.log("clicked header");
//     document.querySelector("body").style.backgroundColor = "red";
// }

document.querySelector("#image-6").addEventListener("click", function(){
    // document.querySelector("#image-6").style.visibility = "visible";
    alert("halo halo halo");
})
document.querySelector("#image-5").addEventListener("click", function(){
    document.querySelector("#image-6").style.visibility = "visible";
})
document.querySelector("#image-4").addEventListener("click", function(){
    document.querySelector("#image-5").style.visibility = "visible";
})
document.querySelector("#image-3").addEventListener("click", function(){
    document.querySelector("#image-4").style.visibility = "visible";
})
document.querySelector("#image-2").addEventListener("click", function(){
    document.querySelector("#image-3").style.visibility = "visible";
})
document.querySelector("#image-1").addEventListener("click", function(){
    document.querySelector("#image-2").style.visibility = "visible";
})
document.querySelector("#image-0").addEventListener("click", function(){
    document.querySelector("#image-1").style.visibility = "hidden";
})

