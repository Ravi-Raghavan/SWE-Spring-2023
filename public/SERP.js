const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("6fa935658bf8886eda447f7da5cf3b135563b04b34dccb8c531726d7bc172f3f") //Stop SERP Api Search

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
