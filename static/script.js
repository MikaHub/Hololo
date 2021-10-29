const socket = new WebSocket("ws://localhost:3001");
// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Nouvelle valeur');
    console.log('Nouvelle valeur');
});

//Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Event listen:', event.data);
    document.getElementById("value").innerHTML = event.data;
});

const sendMessage = () => {
    socket.send('Hello From Client1!');
    console.log('Hello From Client1!');
}
