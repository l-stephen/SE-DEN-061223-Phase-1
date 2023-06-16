document.addEventListener('DOMContentLoaded', () => {

    // Fetch requests 
        // Function for making a GET request 
        function fetchResource(url){
            return fetch(url)
            .then(res => res.json())
        }
    // Rendering functions
        // Renders Header
        function renderHeader(store){
            document.querySelector('h1').textContent = store.name
        }
        // Renders Footer
        function renderFooter(store){
            const footerDivs = document.querySelectorAll('footer div')
            footerDivs[0].textContent = store.name
            footerDivs[1].textContent = store.address
            footerDivs[2].textContent = store.hours
        }
    
        function handleDelete(cardData,event){
            event.preventDefault()
            fetch(`http://localhost:3000/books/${cardData.id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            })
            .then(res => res.json())
            .then(event.target.parentElement.remove())
        }
    
        function handleUpdate(cardData, event){
            event.preventDefault()
    
            const obj = {
                inventory: event.target.value
            }
    
            fetch(`http://localhost:3000/books/${cardData.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .catch(e => console.log(e))
        }
    
        function renderBookCard(cardData) {
            const li = document.createElement('li')
            const h3 = document.createElement('h3')
            const pAuthor = document.createElement('p')
            const pPrice = document.createElement('p')
            const img = document.createElement('img')
            const pInventory = document.createElement('input')
            const btn = document.createElement('button')
    
            h3.textContent = cardData.title
            pAuthor.textContent = cardData.author
            pPrice.textContent = `$${cardData.price}`
            btn.textContent = 'Delete'
            pInventory.type = "number"
            pInventory.value = cardData.inventory
    
            img.src = cardData.imageUrl
            li.className = 'list-li'
    
            //Event Listeners 
            btn.addEventListener('click',(e) => handleDelete(cardData, e))
    
            // btn.addEventListener('click',(e) => {
            //     e.preventDefault()
            //     fetch(`http://localhost:3000/books/${cardData.id}`, {
            //     method: "DELETE",
            //     headers: {"Content-Type": "application/json"},
            // })
            //     .then(res => res.json())
            //     .then(event.target.parentElement.remove())
            // })
    
            pInventory.addEventListener("change", (e) => handleUpdate(cardData, e))
        
            li.append(h3,pAuthor,pPrice,img,btn, pInventory)
            document.querySelector('#book-list').append(li)
        }
    
        //refactor the post request to its own function
        function createResource(url, body){
            return fetch(url, {
                method: "POST", 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            .then(res => res.json())
        }
    
    // Event Handlers
        function handleForm(e){
            e.preventDefault()
            //Builds Book
            const book = {
                title: e.target.title.value,
                author:e.target.author.value,
                price: e.target.price.value,
                imageUrl: e.target.imageUrl.value,
                inventory:e.target.inventory.value,
                reviews:[]
            }
    
            // fetch("http://localhost:3000/books", {
            //     method: "POST",
            //     headers: {"Content-Type": "application/"},
            //     body: JSON.stringify(book)
            // })
            // .then(res => res.json())
            // //another way to send the returned response to renderBookCard
            // // .then(data => renderBookCard(data))
            // .then(renderBookCard)
            // .catch(e => console.log(e))
    
            createResource("http://localhost:3000/books", book)
            .then(renderBookCard)
            .catch(e => console.log(e))
    
        }
    
    
    // Invoking functions    
        fetchResource('http://localhost:3000/stores/1')
        .then(store => {
            renderHeader(store)
            renderFooter(store)
        })
        .catch(e => console.error(e))
    
        fetchResource('http://localhost:3000/books')
        .then(books => books.forEach(renderBookCard))
        .catch(e => console.error(e))
    
        document.querySelector('#book-form').addEventListener('submit', handleForm)
    
    })