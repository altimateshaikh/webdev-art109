console.log("sup");


let pageTitle = document.querySelector("#page-title")


// title chances color after 3 seconds
setTimeout(function(){
pageTitle.style.color= "pink";
} , 3000);
// click event on header changes background color

document.querySelector("header").onclick = function(){
    //console.log("clicked header");
    document.querySelector("body").style.backgroundColor = "red";
}



