import React, {useState, useEffect } from 'react'
import Moment from 'react-moment';
import { useForm } from "react-hook-form";
import axios from 'axios'
import socket from '../Connection'


const Message = () => {
  const {register, handleSubmit } = useForm()
  const [user, setUser] = useState();
  const [allMessage, setAllMessage] = useState([])

  useEffect(()=> {
    axios.get('/v1/getUser', {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
        const {username} = response.data.data
        setUser(username)
    }).catch((error)=> {
      console.log(error);
    })
    socket.emit('general.room', user)
    socket.on('All.general.message', (data)=> {
        setAllMessage(data)
      })
  },[user])


  useEffect(() => {
    socket.on('general.message', (data)=> {
      setAllMessage([...allMessage, data])
    })
  },[allMessage]);

  const onSubmit = (data) => {
    const sentMessage = {...data, sender: user};
    socket.emit('new.message', sentMessage)
  }

  let allMessages

  if(allMessage.length > 0) {
    allMessages = allMessage.map((items, index) => {
     return (
     <div key={index}>
      <h2 className=''>sendBY: {items.sender}</h2>
       <h1>message: {items.message}</h1>
     <small>time: <Moment  fromNow>{items.createdAt}</Moment></small>
     </div>
      )
    })
  }
  return (
    <div className=''>
      <div>
           {allMessages}
      </div>
      <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div>
          <label className='font-bold'>
            Tell everyone whats on your mind
            <div>
            <textarea
            className='border-solid border-4 border-gray-600 '
            name="message"
            ref={register({ required: true})}/>
            </div>
          </label>
        </div>
        <div>
          <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default Message
