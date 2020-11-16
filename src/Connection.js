import io from 'socket.io-client';
import axios from 'axios'

const ENDPOINT = 'localhost:5000'
let socket;
socket = io(ENDPOINT)

if(localStorage.getItem('token')) {
  axios.get('/v1/getUser', {
    'headers': {
      "Content-Type": "application/json",
      "token": localStorage.getItem('token')
    }
  }).then((response) => {
   const {id} = response.data.data
   socket.emit('logged-in', id)
  }).catch((error)=> {
    console.log(error);
  })
}
socket.on('disconnect', () => {
  socket.emit('online', {senderId: socket.id})
});

 export default socket