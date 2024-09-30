//horizontal scroll
document.addEventListener("mousewheel", (e) => {
  window.scrollTo({ left: window.scrollX + e.deltaY });
});

let myKey = "5KS37821jmWz0xnrBKSGGETsVwCYDcID";
let year = "2024";
let beginDate = year +"0101";
let endDate = year +"1231";
let subwayRequestURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=subway&" + "begin_date=" + beginDate + "&end_date=" + endDate + "&fq=headline.search(%22subway%22%20%22MTA%22)%26glocations(%22NEW%20YORK%20CITY%22)&sort=relevance&api-key=" + myKey;

//display selected year
let yearSelector = document.querySelector(".year-section")
yearSelector.innerHTML = "<p class='subway-font'> select year</p> <p class='subway-font'>{[" + year + "]}</p>";

fetch(subwayRequestURL)
  //fetch data
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then(err => {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            errorMessage: err,
          });
        });
      })
    
    .then(data => {
        let articles = data.response.docs;
        
        console.log(articles);

        //create a function for displaying headline, date, abstract, and link in the poster, to be called later in the for loop
        function displayPoster (num){
          //headline
          let selectedHeadline = articles[num].headline.main;
          let posterHeadline = document.querySelector("#poster-headline");
          posterHeadline.innerText = selectedHeadline;
          //date
          let dateString = articles[num].pub_date;
          let date = new Date (dateString); // format the date string from data
          let options = {year: 'numeric', month: 'long', day: 'numeric'}
          let selectedPubDate = date.toLocaleString("en-US", options);
          let posterPubDate = document.querySelector("#poster-date");
          posterPubDate.innerText = selectedPubDate;
          //abstract
          let selectedAbstract = articles[num].abstract;
          let posterAbstract = document.querySelector("#poster-abstract");
          posterAbstract.innerText = selectedAbstract;
          //link
          let posterLinkBox = document.querySelector("#poster-link");
          posterLinkBox.innerHTML = "<a href='" + articles[num].web_url + "'>Read full article</a>"
          //grab image and display in poster
          let jumboURL=articles[num].multimedia[8].url;
          let imgURL="https://static01.nyt.com/" + jumboURL;
          let articleImage = document.querySelector("#article-image");
          articleImage.style.backgroundImage= `url('${imgURL}')`;
          articleImage.style.backgroundSize = "cover"; 
          articleImage.style.backgroundPosition = "center";
      }
    
  //Articles Section
    //grab top 10 article headlines and do something
    for(let i=0; i<10; i++){
        let headlines = articles[i].headline.main;
        //console.log(headlines);
        
        //add 10 headlines on webpage
        let tenHeadlines = document.querySelector("#ten-headlines");
        let headlinePara = document.createElement("p");
        headlinePara.innerText=headlines;
        tenHeadlines.appendChild(headlinePara);
        //console.log(tenHeadlines);

        headlinePara.className = "articleHeadlines";

        //add event for clicking on each headline and display poster
        headlinePara.addEventListener("click", ()=> {
          //let num = i; //find index number for the clicked title
          //console.log(num);

          let allHeadlines = document.querySelectorAll(".articleHeadlines");
          allHeadlines.forEach(el => {
            el.style.color = ""; // reset to default color when not selected
          });
          headlinePara.style.color = "yellow"; // change the clicked headline to

          displayPoster(i);
        })

        //automatically "click" the first article when the page is loaded
        if (i==0) {
          headlinePara.click();
        }
    }
    
    
    //create an array for ALL of the subject keywords
    let subjKey = [];

    //grab the keyword array from the article
    for(let k = 0; k < articles.length; k++){
        let articleKeyWords = articles[k].keywords;
        //console.log(articleKeyWords);
        
        //loop through the keywords to grab the ones with name 'subject'
        for (let j = 0; j < articleKeyWords.length; j++ ){
            if (articleKeyWords[j].name = "subject"){
                //console.log(articleKeyWords[j].value);
                let theCurrentWord = articleKeyWords[j].value;
                subjKey.push(theCurrentWord);
            }
        } 
    }
        
        //sort the subject keywords array
          //1. sort by frequency
          function sortByFq(subjKey){
            let frequencyMap = {};
            for (let word of subjKey) {
                frequencyMap[word] = (frequencyMap[word] || 0) + 1;
            }
            subjKey.sort((a, b) => {
                const freqA = frequencyMap[a];
                const freqB = frequencyMap[b];
                if (freqA !== freqB) {
                  return freqB - freqA; // Sort by frequency in descending order
                } else {
                  return a.localeCompare(b); // If frequencies are the same, sort alphabetically
                }
              });
              return subjKey;
         }

         let keywordsByFq = sortByFq(subjKey);
         //console.log(keywordsByFq);

          //2. remove duplicates
          let uniqueKeywordsSet = keywordsByFq.sort((a, b) => a - b);
          let uniqueKeywords = [...new Set(uniqueKeywordsSet)]; //turn Set into an Array
          //console.log(uniqueKeywords);

          //3. remove non-content related keywords
        let keywordsToRemove = [
          "Subways",
          "Metropolitan Transportation Authority",
          "New York City",
          "New York State",
          "Transit Systems",
          "Buses",
          "Stations and Terminals (Passenger)",
          "Brooklyn, NY",
          "Brooklyn (NYC)",
          "Manhattan, NY",
          "Manhattan (NYC)"
          ];
        let filteredUniqueKeywords = uniqueKeywords.filter(result => 
          !keywordsToRemove.some(keyword => result.includes(keyword))
        );

        //show top 10 unique keywords
        for(l = 0; l < 10; l++){
            //console.log(filteredUniqueKeywords[l]);
            let tenKeywords = document.querySelector("#ten-keywords");
            let paragraph = document.createElement("p");
            paragraph.innerText=filteredUniqueKeywords[l];
            
            tenKeywords.appendChild(paragraph);

            // //random position for each unique keyword
            // const x = Math.random() * (tenKeywords.clientWidth - 100);
            // const y = Math.random() * (tenKeywords.clientHeight - 30);

            // paragraph.style.left = `${x}px`;
            // paragraph.style.top = `${y}px`;
        }


    })

    .catch(err => {
        console.error(err);
      });
