
// this tutorial:https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html

import https from 'https';
import cheerio from 'cheerio';
const url = "https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1%27";
const hostname = "premierleague.com";
const path = "/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1%27";

type User = {
    id: number,
    firstName: string,
    lastName: string,
    userName: string
};

// Get HTML. Can also use axios
// Probably not getting all data in one chunk so have to keep 
// track of when we receive data then add it to the html variable
// when end event (received entire response body) we return the html
// using the resolve function that is provided by the Promise constructor
const getHtml = async (hostname: string, path: string): Promise<string> =>
    new Promise((resolve, reject) => {
        https
            .get(
                {
                    hostname,
                    path,
                    method: "GET",
                },
                (res) => {
                    let html = "";
                    res.on("data", function (chunk) {
                        html += chunk;
                    });
                    res.on("end", function () {
                        resolve(html);
                    });
                }
            )
            .on("error", (error) => {
                console.error(error);
                reject(error);
            });
    });



// Get specified table element (from chrome devtools. In bottom CSS selector after selecting an item)
const getTables = (html: string): cheerio.Cheerio => {
    const $ = cheerio.load(html);
    const tableElements = $(
        "html body div.wrapper div.container table.table.table-bordered"
    );
    return tableElements;
};



// Receive table to slice and slice 2 first tables
const takeFirstTwoTables = (tables: cheerio.Cheerio): cheerio.Cheerio =>
    tables.slice(0, 2);



// Get table and use a tbody tr CSS selector on each table to iterate over the rows 
// - extracting the text from the individual td elements with .children.text
const getUsers = (table: cheerio.Element): User[] => {
    const users: User[] = [];

    const $ = cheerio.load(table);
    $("tbody tr").each((_, row) => {
        users.push({
            id: Number($($(row).children()[0]).text()),
            firstName: $($(row).children()[1]).text(),
            lastName: $($(row).children()[2]).text(),
            userName: $($(row).children()[3]).text(),
        });
    });

    return users;
};



export function GetScraping(){
    getHtml("webscraper.io", "/test-sites/tables")
        .then(getTables)
        .then(takeFirstTwoTables)
        .then((tables) => {
            let users: User[] = [];
            tables.each((_, table) => (users = users.concat(getUsers(table))));
            return users;

        })
        .then((users)=> console.log(users))
        .catch((error)=> console.log(error));
}










// Det Saad gjorde
// -----------------------------------------------------------------------------
/*https.get("https://en.wikipedia.org/wiki/List_of_PC_games_(A)", function(res){
    let pageData = "";

    res.on("data", function(data){
        pageData+=data;
    });
    res.on("end", function() {
        const $ = cheerio.load(pageData);

        const header: string[] = []; // ["Name", undefined, "Developer", ... ]

        $('.wikitable th').each((i, elem) => {
            header[i] = $(elem).text().toLowerCase();
            //console.log($(elem).text());
        })
    });
});*/
// -----------------------------------------------------------------------------

