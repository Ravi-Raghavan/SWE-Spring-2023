const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("") //Stop SERP Api Search

async function executeQuery(query){

    return await new Promise((resolve, rejects) => {
        search.json({
            q: `site:https://www.webmd.com/drugs ${query}`, 
            location: "Austin, TX"
           }, (result) => {
                resolve(JSON.stringify(result))
        })
    })
}



module.exports = {
    executeQuery: executeQuery
}