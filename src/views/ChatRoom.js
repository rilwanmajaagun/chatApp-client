import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import Moment from 'react-moment';
import socket from '../Connection'



const ChatRoom = ({ location }) => {
  const history = useHistory();
  
  if(!localStorage.getItem('token')){
    history.push('/login')
  }
  
  const [room, setRoom] = useState()
  const [name, setName] = useState()
  const [message, setMessage] = useState()
  const [messages, setMessages] = useState()
  const [allRoomMessage, setAllRoomMessage] = useState([])


  useEffect(() => {
    const { name , room } = queryString.parse(location.search)
    setName(name)
    setRoom(room)
    
    socket.emit('join', {name, room}, ()=> {})

    socket.on('roomMessages', (data) => {
      setAllRoomMessage(data)
     })

    return ()=> {
      socket.emit('disconnect');

      socket.off()
    }
  }, [location.search])

  useEffect(()=> {
    socket.on('message', (data)=> {
      setMessage(data.user)
    })
  }, [])


  const leaveRoom = () => {
    socket.emit('leave.room', {room, name})
    history.push('/')
  }

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit('room.message',{name, room, messages})
  }

  useEffect(()=> {
    socket.on('new.room.message', (data)=> {
    console.log("ChatRoom -> data", data)
      setAllRoomMessage([...allRoomMessage, data])
    })
  }, [allRoomMessage]);


  let allMessages;
  if(allRoomMessage.length > 0) {
    allMessages = allRoomMessage.map((items, index) => {
      return (
        <div key={index}>
          <div>{items.username}</div>
          <div>{items.message}</div>
          <small>time: <Moment  fromNow>{items.createdAt}</Moment></small>
        </div>
      )
    })
  }

  return (
    <div>
      <h1>{message}</h1>
      <button type='submit' onClick={leaveRoom}>
        Leave Room
      </button>
      <form>
        <textarea name='message'
        onChange={(event) =>setMessages(event.target.value)}
        onKeyPress={event=> event.key ==='Enter' ? sendMessage(event) : null}/>
        <button type='submit' onClick={sendMessage}>
          Send
        </button>
      </form>
      <h2>
        {allMessages}
      </h2>
    </div>
  )
}

export default ChatRoom
