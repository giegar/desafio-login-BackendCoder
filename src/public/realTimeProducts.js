const socket = io();

const form = document.getElementById('form');
const addButton = document.querySelector('#addbtn');
const productsList = document.getElementById('productsList');

form.addEventListener('submit', async (e) => {

        e.preventDefault();

        let newForm = {
                title: document.querySelector('#title').value,
                description: document.querySelector('#description').value,
                category: document.querySelector('#category').value,
                price: document.querySelector('#price').value,
                thumbnail: document.querySelector('#thumbnail').value,
                stock: document.querySelector('#stock').value,
                code: document.querySelector('#code').value,
        };

    const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(newForm),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const saveInDB = response.json();
        if(saveInDB.status === 'error'){
            console.log(response.status)
            throw new Error(result.error)
        } else{
            socket.emit("newProduct", newForm);
        }
    
    document.querySelector('#title').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#thumbnail').value = '';
    document.querySelector('#stock').value = '';
    document.querySelector('#code').value = '';

})

socket.on('refreshProducts', data => {
            document.querySelector('#productsList').innerHTML +=
            `<div>
                <h4>${data.title}</h4>
                <p>${data.description}</p>
                <p>${data.category}</p>
                <p>${data.price}</p>
                <p>${data.thumbnail}</p>
                <p>${data.code}</p>
                <p>${data.stock}</p>
            </div>`
})