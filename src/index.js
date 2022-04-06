let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  start()
  getToys()
  createToyForm()
});

function start(){
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function getToys(){
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => toys.forEach(toy => renderToy(toy)))
  .catch(() => window.alert("There was a problem loading the page"))
}

function renderToy(toy){
  const toyCard = document.createElement('div')
  toyCard.className = 'card'

  const name = document.createElement('h2')
  name.innerText = toy.name

  const img = document.createElement('img')
  img.src = toy.image
  img.className = "toy-avatar"

  const likes = document.createElement('p')
  likes.innerText = `Likes: ${toy.likes}`

  const likeBttn = document.createElement('button')
  likeBttn.innerText = "Like ❤️"
  likeBttn.id = toy.id
  likeBttn.addEventListener('click', addLikes)

  toyCard.append(name, img, likes, likeBttn)
  document.querySelector('#toy-collection').append(toyCard)
}

function addLikes(e){
  let likes = e.target.previousElementSibling.innerText.split(' ')

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      "likes": Number(likes[1]) + 1 
    })
  })
  .then(response => response.json())
  .then(obj => e.target.previousElementSibling.innerText = `Likes: ${obj.likes}`)
  .catch(() => window.alert("There was a problem with the server"))

   }

   function createToyForm(){
     const form = document.querySelector(".add-toy-form")
     form.addEventListener("submit", e => createToySubmit(e))
   }

   function createToySubmit(e){
    e.preventDefault()
     if(e.target.name.value === "" || e.target.image.value ===""){
       window.alert("Please fill out all the form")
     }
     else{
      fetch('http://localhost:3000/toys', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          "name": e.target.name.value,
          "image": e.target.image.value,
          "likes" : "0"
        })
      })
      .then(response => response.json())
      .then(toy => renderToy(toy))
      .catch(() => window.alert("There was a problem adding a toy to the Toybox. Try again!") )
      e.target.reset()
      document.querySelector(".container").style.display = "none";
      start()
    }
   }


