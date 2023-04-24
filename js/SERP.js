const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("e99aa8afe3d9cdacf0687b06293a13cdb9ab12528eccc995a77f9fc9df231340") //Stop SERP Api Search

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
