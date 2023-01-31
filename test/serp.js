const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("5aae37aa0093a0ac022d125d55ae19873e56cdd17a7f69aa110b0064d16dcafd")

search.json({
 q: "Coffee", 
 location: "Austin, TX"
}, (result) => {
  console.log(result)
})
