

fetch("https://serpapi.com/search.json?engine=google&q=Whatislife?")
.then((response) => {
    response.json().then((json) => {
        var organicResults = json["organic_results"]
        console.log("JSON: " + JSON.stringify(organicResults[0]));
    })
})


