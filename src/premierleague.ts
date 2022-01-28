//https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1%27
// using axios

import axios from 'axios';
import cheerio from 'cheerio';
const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';

const axiosInstance = axios.create();

type PlayerData = {
    rank: number;
    name: string;
    nationality: string;
    goals: number;
}


export function GetScraping(){
    
    //Send async HTTP Get request to the url
    axiosInstance.get(url)
        .then( //oince we have data returned ...
            response => {
                const html = response.data; // Get the HTML from the HTTP request
                // parse the html string to sort out unwanted stuff 
                // all except the class -statsTablecontainer that has tablerows in it
                const $ = cheerio.load(html);
                const statsTable = $('.statsTableContainer > tr');
                const topScorers: PlayerData[] = [];
                
                // Extract rank, player name, nationality, number of goals from each row
                statsTable.each((i, elem) => {
                    const rank: number = parseInt($(elem).find('.rank > strong').text());
                    const name: string = $(elem).find('.playerName > strong').text();
                    const nationality: string = $(elem).find('.playerCountry').text(); 
                    const goals: number = parseInt($(elem).find('.mainStat').text());
                    topScorers.push({
                        rank,
                        name,
                        nationality,
                        goals
                    })
                })
                console.log(topScorers);
            })
        .catch(console.error); // error handling
}

// select all the rows of the table body with the class .statsTableContainer
