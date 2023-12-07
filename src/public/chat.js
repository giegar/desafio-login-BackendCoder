console.log("Iniciando chat");

const user = prompt('Insert username')
const socket = io()

const input = document.querySelector('#input')

input.addEventListener('keyup', async (event) => {

    if(event.key === 'Enter'){
        sendMessage(event.currentTarget.value); 
    }
})

document.querySelector('#send').addEventListener('click', event => {
    sendMessage(input.value)
})

function sendMessage(msg) {
    let newMsg = {
        user: user,
        message: msg,
    }

    if (newMsg.message.trim().length > 0){
        socket.emit('message', newMsg)
    }

    input.value = '';
} 


socket.on('logs', messages =>{
    const chatbox = document.querySelector('#chatbox');
    let html = ''

    messages.reverse().forEach(message => {
        html += `
            <p><i>${message.user}</i>: ${message.message}</p>
        `
    })

    chatbox.innerHTML = html    
})


/*const input = document.querySelector('#input')
input.addEventListener('keyup', event => {
    if(event.key === 'Enter'){
        sendMessage(event.currentTarget.value)
    }
})

document.querySelector('#send').addEventListener('click', event => {
        sendMessage(input.value)
})

async function saveMsg (message){
    await MsgModel.create({...message})
}

function sendMessage(message) {
    if(message.trim().length > 0){
        socket.emit('message', { user, message  })
    }
}

socket.on('logs', messages =>{
    const chatbox = document.querySelector('#chatbox');
    let html = ''

    messages.reverse().forEach(message => {
        html += `
            <p><i>${message.user}</i>: ${message.message}</p>
        `
    })

    chatbox.innerHTML = html    
}); */