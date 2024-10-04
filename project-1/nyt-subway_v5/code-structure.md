Code structure:
1) Get API URL
2) Grab top 10 articles
3) Sort the data (especially keywords)
- Key moment: filter subject keywords only, remove duplicates, sort by highest frequency
4) Articles section:
- Display 10 headlines (add hover and select effect)
- Use event.listener to select a specific headline, and show more info on the bigger poster (image, headline, abstract, date, and link)
- Key moment: how to automatically display the first article in the poster? Solution: take the display function out of the for-loop and add a condition witihin the for-loop that automatically "select" the first article when the loop starts
5) Keywords section: 
- Display 10 most frequent keywords from the top 10 articles (add hover and select effect)
- Use event.listener to select a specific keyword and lead to a search result page on NYT
- Key moment: learn to parse out and assemble a URL (e.g. image URL, search URL, etc.)
6) Year selector section:
- still trying to figure out...

Design and Style:
Key moments:
- How to horizontal scroll (and flex box)
- Graffiti: placement (absolute position, z-index, margins), customized fonts – just a lot of tries! 
- How to set width of each section: use min.width