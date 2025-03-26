fetch('db.json')
    .then(response => response.json())
    .then(data => {
        
    })
    .catch(error => console.error('Error loading data:', error));