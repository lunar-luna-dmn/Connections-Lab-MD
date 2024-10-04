//horizontal scroll
document.addEventListener("mousewheel", (e) => {
  window.scrollTo({ left: window.scrollX + e.deltaY });
});

//set up API
let myKey = "5KS37821jmWz0xnrBKSGGETsVwCYDcID";
let year = 2024; //automatically set the API to fetch 2024 content
let subwayRequestURL;

function getURL (year) {
  let beginDate = year +"0101";
  let endDate = year +"1231";
  subwayRequestURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=subway&" + "begin_date=" + beginDate + "&end_date=" + endDate + "&fq=headline.search(%22subway%22%20%22MTA%22)%26glocations(%22NEW%20YORK%20CITY%22)&sort=relevance&api-key=" + myKey;
}

//automatically display 2024 content
getURL(year);
fetchData(subwayRequestURL);

//set up year selector
function displayYear (year){
  let yearSelector = document.querySelector("#year-info");
  let leftArrowString = "{[";
  let rightArrowString = "]}";
  yearSelector.innerHTML = "<span> select year </span>" + "<span id='left-arrow'>" + leftArrowString + "</span>" + "<span>" + year + "</span>" + "<span id='right-arrow'>" + rightArrowString + "</span>";
}
displayYear(year);

//add event listener to arrow spans to increase or decrease the integral year
let leftArrow = document.querySelector("#left-arrow");
let rightArrow = document.querySelector("#right-arrow");
leftArrow.addEventListener("click", ()=> {
  console.log("clicked L");
    year=year-1;
    console.log(year);
    displayYear(year);
    getURL(year);
    fetchData(subwayRequestURL);
    window.scrollBy({
      left: -window.innerWidth/1.5,
      behavior: 'smooth'
    });
    // console.log(subwayRequestURL);
})
rightArrow.addEventListener("click", ()=> {
  if (year<2024) {
    year=year+1;
    console.log(year);
    displayYear(year);
    getURL(year);
    fetchData(subwayRequestURL);
    // console.log(subwayRequestURL);
  } else {
    window.alert("We don't live in the future.");
  }
})


function fetchData (subwayRequestURL) {
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
          posterLinkBox.innerHTML = "<a href='" + articles[num].web_url + "' target='_blank'>Read full article</a>"
          //grab image and display in poster
          let jumboURL=articles[num].multimedia[8] ? articles[num].multimedia[8].url : null;
          let articleImage = document.querySelector("#article-image");
          if (jumboURL) {
            let imgURL="https://static01.nyt.com/" + jumboURL;
            articleImage.style.backgroundImage= `url('${imgURL}')`;
          } else {
            articleImage.style.backgroundColor = "#111111";
          }
          articleImage.style.backgroundSize = "cover"; 
          articleImage.style.backgroundPosition = "center";
      }
    
  //Articles Section
    //grab top 10 article headlines and do something
    let tenHeadlines = document.querySelector(".ten-headlines"); //moved from the for loop to here
    tenHeadlines.innerHTML = ""; //combined with the above, it clears the headlines board every time the subwayRequestURL is refreshed (so the new content will replace instead of adding on top of the old content)
    for(let i=0; i<10; i++){
        let headlines = articles[i].headline.main;
        //console.log(headlines);
        
        //add 10 headlines on webpage
        let headlinePara = document.createElement("p");
        headlinePara.innerText=headlines;
        tenHeadlines.appendChild(headlinePara);
        //console.log(tenHeadlines);

        headlinePara.className = "articleHeadlines";

        //add event for clicking on each headline and display poster
        headlinePara.addEventListener("click", ()=> {
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
    
  //Keywords section
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
    let tenKeywords = document.querySelector("#ten-keywords");
    tenKeywords.innerHTML = ""; //each time the subwayRequestURL changes, it clears the keyword board
    for(l = 0; l < 10; l++){
        //console.log(filteredUniqueKeywords[l]);
        
        let keywordPara = document.createElement("p");
        keywordPara.innerText=filteredUniqueKeywords[l];
        tenKeywords.appendChild(keywordPara);

        //add event for clicking on each keyword and link to NYT search
        keywordPara.addEventListener("click", ()=> {
          let encodedKeyword = keywordPara.textContent.toLowerCase().replace(/ /g, "%20");
          console.log(encodedKeyword)
          let link = "https://www.nytimes.com/search?dropmab=false&lang=en&query=nyc%20subway%20" + encodedKeyword + "&sort=best";
          console.log(link);
          window.open(link, "_blank");
    })
    }
    })

    .catch(err => {
        console.error(err);
      });
    }