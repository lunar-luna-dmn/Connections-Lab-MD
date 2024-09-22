
console.log("page is loading");

// window.addEventListener("load", ()=>{
//     console.log("Page is loaded!");
// })

// window.onload = () => {
//     console.log("Page is loaded!");
//     fetch("sandwiches.json") //request to fetch json 
//         .then (function(response) { //get a response from the json
//             return response.json(); //return the json data of the file
//             console.log(response.json());
//     })
//         .then (function(data){ //turn json data into JS object and do something
//             //do something
//             console.log(data);
//             console.log(data.description);
//             console.log(data.sandwiches[0])
//         })
// }

window.onload = () => {
    console.log("page is loaded!");
    fetch('sandwiches.json')
    // .then(response => {
    //     return response.json()
    //     console.log(response.json())
    // })
    .then(response => response.json()) //same as the previous

    .then(data => {
        //do something here
        console.log(data);
        console.log(data.sandwiches[0].name);
    })
    
    .catch(error => {
        console.log(error);
    })
}

// fetch('sandwiches.json')
// .then(response => response.json())
// .then(data => {
//     console.log(data);
//     let firstSandwich = data.sandwiches[0].name;
//     console.log(firstSandwich);
// });