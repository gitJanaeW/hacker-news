// to get the upvote button working
// async because it will be making a PUT request with fetch()
async function upvoteClickHandler(event) {
    event.preventDefault();
    // get the url (location) from the window, split after the slash and get the index then substract it by one to get the id
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);