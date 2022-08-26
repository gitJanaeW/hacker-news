async function deleteFormHandler(event) {
    event.preventDefault();
    post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ]
    if(post_id) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);