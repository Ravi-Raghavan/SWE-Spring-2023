const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("5aae37aa0093a0ac022d125d55ae19873e56cdd17a7f69aa110b0064d16dcafd")

async function executeQuery(query){

    return await new Promise((resolve, rejects) => {
        search.json({
            q: `${query}`, 
            location: "Austin, TX"
           }, (result) => {
                resolve(JSON.stringify(result))
        })
    })
}



module.exports = {
    executeQuery: executeQuery
}