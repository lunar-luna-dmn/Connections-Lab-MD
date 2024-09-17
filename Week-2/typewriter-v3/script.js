let button=document.getElementById("help-button");
let typeBox=document.getElementsByClassName("typewriter");

console.log(typeBox[0]);

//listen for event clicking, and do something
button.addEventListener("click", ()=>{
    // console.log("helppppp");
    // alert("Never mind. You are fine.");
    typeBox[0].classList.add("erasure"); // Add the class for the removing animation
    console.log(typeBox[0])
})


// // Start the animation over again, and add the original class back
// element.addEventListener("animationend", () => {
//     // remove the erasing class
//     element.classList.remove("myAnimationClass")
//     // Add the original class
//     element.classList.add("MyBeginningClass");
//     }, {once: true});