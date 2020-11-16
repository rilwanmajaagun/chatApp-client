/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react'
import { useForm } from "react-hook-form";
import socket from '../Connection'
import queryString from 'query-string'
import axios from 'axios'
import Moment from 'react-moment';
import addNotification from 'react-push-notification'
import { useHistory } from 'react-router-dom';


const PrivateMessage = ({ location }) => {
  const { register, handleSubmit, reset } = useForm()
  const [senderId, setSenderId] = useState()
  const [receiverId, setReceiverId] = useState()
  const [receiverName, setReceiverName] = useState()
  const [message, setMessage] = useState([])
  const [senderName, setSenderName] = useState()
  const [type, setType] = useState()
  const [userName, setUserName] = useState()
  const [online, setOnline] = useState('offline')

  const clearInterval = 900;

    const history = useHistory()
  let clearTimerId;

  useEffect(() => {
    const { senderId, receiverId, receiverName, senderName } = queryString.parse(location.search)
    axios.get(`/v1/message/${senderId}/${receiverId}`)
      .then((response) => {
        const { data } = response.data
        setMessage(data)
      }).catch((error) => {
        console.log(error);
      })
    setSenderName(senderName)
    setReceiverName(receiverName)
    setSenderId(senderId)
    setReceiverId(receiverId)
  }, [location.search])

  useEffect(() => {
    const { senderId, receiverId } = queryString.parse(location.search)
    socket.emit('online', { senderId, receiverId })
    socket.on('online', (data) => {
      setOnline(data)
    })
  }, [online])

  useEffect(() => {
    const { senderName } = queryString.parse(location.search)
    socket.on('private-message', (data) => {
      addNotification({
        title: `New Message from ${senderName}`,
        message: `${data.message}`,
        theme: 'darkblue',
        duration: 3000,
        native: true
      });
      if (senderId === data.receiverId && receiverId === data._id) {
        setMessage([...message, data])
      }
    })
  }, [message])

  useEffect(() => {
    const { senderId, receiverId } = queryString.parse(location.search)
    socket.emit('typing', { senderName, receiverId, senderId })
    socket.on('typing', (data) => {
      if (senderId === data.receiverId && receiverId === data.senderId) {
        const { username } = data;
        setUserName(username)
      }
    })
  }, [type])

  const onSubmit = (data) => {
    const messagesData = { ...data, senderId, receiverId, date: new Date() }
    socket.emit('private-message', messagesData)
    setMessage([...message, messagesData])
    reset()
  }
  let messages;
  if (message.length > 0) {
    messages = message.map((items, index) => {
      return (
        <Fragment key={index}>
          <div>from: <small>{items.receiverId === receiverId ? 'you' : receiverName}</small></div>
          <div>{items.message}</div>
          <small>time: <Moment fromNow>{items.date}</Moment></small>
        </Fragment>
      )
    })
  }

  const createCall = () => {
    history.push( '/videoCall?room=nexus')
  }

  clearTimeout(clearTimerId)
  clearTimerId = setTimeout(function () {
    setUserName('')
  }, clearInterval)
  
  return (
    <div>
      <div>{receiverName} is {online}</div>
      <button 
      onClick={createCall}
      className='bg-green-500 hover:bg-green-400 text-white font-italic py-2 px-2 rounded focus:outline-none focus:shadow-outline'
      >
      Video call
      </button>
      <h3>
        {messages}
      </h3>
      <div>
        <small>
          {userName && <small>{userName} is typing....</small>}
        </small>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          send message
        <input name='message' type='text'
            onChange={(event) => { setType(event.target.value) }}
            ref={register} />
        </label>
        <button type='submit'>
          send
      </button>
      </form>
    </div>
  )
}

export default PrivateMessage
