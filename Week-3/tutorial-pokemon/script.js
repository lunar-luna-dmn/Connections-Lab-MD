window.onload = () => {
    //console.log("page loaded!")
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
    .then (response => response.json())
    .then (data => {
        // console.log(data.results[0].name);
        let pokemonArray = data.results;
        let randomNumber = Math.floor(Math.random()*pokemonArray.length);
        let pokemonName = document.querySelector("#random-pokemon-name");
        pokemonName.innerHTML = data.results[randomNumber].name;
    })

    let button = document.querySelector("#pokemon-button");
    button.addEventListener("click", ()=>{
        let inputText = document.querySelector("#input-name").value;
        // console.log("button clicked");
        // console.log("name typed is: " + inputText);

        let API_URL = "https://pokeapi.co/api/v2/pokemon/" + inputText;
        fetch(API_URL)
        .then (response => response.json())
        .then (data => {
            //console.log(data);
            let pName = document.querySelector("#p-name");
            pName.innerHTML = data.name;
            // let pWeight = document.querySelector("#p-weight");
            // pWeight.innerHTML = data.weight;
            let pImg = document.querySelector("#p-img");
            pImg.src = data.sprites.front_default;

            //show abilities (more than one elements)
            let pAbilities = document.querySelector("#p-abilities");
            let abilities = data.abilities;
            console.log(abilities);
            for (let i=0; i<data.abilities.length; i++) {
                console.log(data.abilities[i].ability.name);
                let elt=document.createElement("p");
                elt.innerHTML=data.abilities[i].ability.name;
                pAbilities.appendChild(elt);
            }
        })
        .catch(error => {
            console.log("error is: " + error);
            let pName = document.querySelector("#p-name");
            pName.innerHTML = "Could not find pokemon, try again!";
            let pWeight = document.querySelector("#p-weight");
            pWeight.innerHTML = "";
            let pImg = document.querySelector("#p-img");
            pImg.src = "";
        })
    })

}