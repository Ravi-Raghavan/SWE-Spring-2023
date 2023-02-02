const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("5aae37aa0093a0ac022d125d55ae19873e56cdd17a7f69aa110b0064d16dcafd")

search.json({
 q: "What is AIDS?", 
 location: "Austin, TX"
}, (result) => {
  var organic_results = results[organic_results]
  console.log(result)
})
