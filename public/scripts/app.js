function deleteFile(fileName) {
   
    fetch(`/delete-file/${fileName}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        location.reload();  // Reload the page or remove the file from the UI
    })
    .catch(error => {
        console.error('Error deleting file:', error);
    });
}
