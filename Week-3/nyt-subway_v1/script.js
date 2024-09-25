let myKey = "5KS37821jmWz0xnrBKSGGETsVwCYDcID";
let subwayRequestURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline.search(%22subway%22%20%22MTA%22)%26glocations(%22NEW%20YORK%20CITY%22)&q=subway&api-key=" + myKey;

fetch(subwayRequestURL)
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
        //console.log(data);
        let articles = data.response.docs;
        
        //log out all of the articles
        //console.log(articles);
        
        //grab top 10 headlines and show on website
        for(let k=0; k<articles.length; k++){
            let headlines = articles[k].headline.main;
            //console.log(headlines);
            
            //add 10 headlines on webpage
            let tenHeadlines = document.querySelector("#ten-headlines");
            let paragraph = document.createElement("p");
            paragraph.innerText=headlines;
            tenHeadlines.appendChild(paragraph);
            //console.log(tenHeadlines);}
          }

        //create an array for ALL of the subject keywords
        let subjKey = [];

        //loop through the articles
        for(let i = 0; i < articles.length; i++){
            //grab the keyword array from the article
            let articleKeyWords = articles[i].keywords;
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
            for (const word of subjKey) {
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
        let uniqueKeywords = keywordsByFq.sort((a, b) => a - b);
        let sortedKeywords = new Set(uniqueKeywords);
        console.log(sortedKeywords)

        //show top 10 keywords
        for(l = 0; l < 10; l++){
            let tenKeywords = document.querySelector("#ten-keywords");
            let paragraph = document.createElement("p");
            paragraph.innerText=sortedKeywords[l];
            console.log(sortedKeywords[l]);
            tenKeywords.appendChild(paragraph);
        }
       
    })

    .catch(err => {
        console.error(err);
      });
