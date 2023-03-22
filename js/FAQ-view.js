var Articles = [];
            fetch(`/faq/articles`, {
                method: 'GET'
            })
            .then((response) => {
                if (response.status == 200){
                    response.json().then((json) => {
                        Articles=json;
                        globalindex = 0;
                        nextResults();
                        hideLeft();
                    })
                }
            })
        
        function NLPResults(){
            var searchQuery = document.getElementById("searchField").value
            
            fetch(`/faq/search?query=${searchQuery}`, {
                method: 'GET'
            })
            .then((response) => {
                if (response.status == 200){
                    response.json().then((json) => {
                        for(let i = 0; i < json.length; i ++){
                            console.log(json[i]);
                        }
                        Articles=json;
                        globalindex = 0;
                        nextResults();
                        hideLeft();
                    })
                }
            })
         }
            
   
            var navLinks = document.getElementById("navLinks");
            function showMenu(){
                navLinks.style.right="0";
            }

            function hideMenu(){
                navLinks.style.right="-200px";
            }

            function showPopup(x){
                result = Articles[globalindex - x];
                document.getElementById("articleTitle").innerText = result["title"]; 
                document.getElementById("articleContent").innerText = result["content"]; 
                document.querySelector('.overlay').style.opacity = 1;
                document.querySelector('.overlay').style.visibility = "visible";
            }

            function exit(){
            document.querySelector('.overlay').style.opacity = 0;
            document.querySelector('.overlay').style.visibility = "hidden";
            }

            function hideLeft(){
                document.querySelector('.left').style.opacity = 0;
                document.querySelector('.left').style.pointerEvents = "none";
            }
            function showLeft(){
                document.querySelector('.left').style.opacity = 1;
                document.querySelector('.left').style.pointerEvents = "auto";
            }

            function hideRight(){
                document.querySelector('.right').style.opacity = 0;
                document.querySelector('.right').style.pointerEvents = "none";
            }
            function showRight(){
                document.querySelector('.right').style.opacity = 1;
                document.querySelector('.right').style.pointerEvents = "auto";
            }
            
            function nextResults(){
                var count = 1;
                var max = globalindex +5;
                for(let i = globalindex; i< Object.keys(Articles).length && i < max; i++){
                    result = Articles[i];  
                    let column  = "col";
                    let temp = column.concat(String(count));
                    document.getElementById(temp).innerText = result["title"];
                    
                    column  = "el";
                    temp = column.concat(String(count));
                    document.getElementById(temp).style.opacity = 1;
                    document.getElementById(temp).style.pointerEvents = "auto";
                    count++;
                 }
                 globalindex +=5;
                 if(count != 6){
                    while(count != 6){
                        let column  = "el";
                        let temp = column.concat(String(count));
                        document.getElementById(temp).style.opacity = 0;
                        document.getElementById(temp).style.pointerEvents = "none";
                        count++;
                    }
                 }

                
                if(Object.keys(Articles).length - max <= 0)
                    hideRight();

                if(globalindex-5 != 0)
                    showLeft();
            }

            function previousResults(){

                globalindex -= 10;
                nextResults();

                showRight();
                if(globalindex - 5 == 0)
                    hideLeft();
            }