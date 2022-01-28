// using axios. Shorter version

import axios from 'axios';
const url = 'https://news.ycombinator.com/';

export function GetScraping(){

    axios.get(url)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
}
