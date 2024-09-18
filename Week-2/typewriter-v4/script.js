let button=document.getElementById("help-button");
let typeBox=document.getElementsByClassName("typewriter");

console.log(typeBox[0]);

//listen for event clicking, and do something
button.addEventListener("click", ()=>{
    // console.log("helppppp");
    // alert("Never mind. You are fine.");
    typeBox[0].classList.add("erasure"); // Add the class for the erase animation
    typeBox[0].innerHTML = "<p id='secondPart'>Never mind. You are fine.</p>"; //After erasing the first part of the story, add the second part to HTML including its style ID
    console.log(typeBox[0])
    typeBox[0].classList.remove("erasure"); // Remove the class for teh erase animation, otherwise "Never mind..." will also be erased
})
