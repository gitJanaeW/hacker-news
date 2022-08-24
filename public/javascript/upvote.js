// to get the upvote button working
// async because it will be making a PUT request with fetch()
async function upvoteClickHandler(event) {
    event.preventDefault();
    // get the url (location) from the window, split after the slash and get the id then substract it by one
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    console.log("LOOK HERE ===============================: ", id);
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);