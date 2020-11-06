import React, { useState, useEffect, Fragment } from 'react'
import { useForm } from "react-hook-form";
import socket from '../Connection'
import queryString from 'query-string'
import axios from 'axios'
import Moment from 'react-moment';

const PrivateMessage = ({ location }) => {
  const { register, handleSubmit } = useForm()
  const [senderId, setSenderId] = useState()
  const [receiverId, setReceiverId] = useState()
  const [receiverName, setReceiverName] = useState()
  const [message, setMessage] = useState([])



  useEffect(() => {
    const { senderId, receiverId, receiverName } = queryString.parse(location.search)
    axios.get(`/v1/message/${senderId}/${receiverId}`)
      .then((response) => {
        const { data } = response.data
        setMessage(data)
      }).catch((error) => {
        console.log(error);
      })
    setReceiverName(receiverName)
    setSenderId(senderId)
    setReceiverId(receiverId)
  }, [])

  useEffect(() => {
    socket.on('private-message', (data) => {
      setMessage([...message, data])
    })
  }, [message])

  const onSubmit = (data) => {
    const messagesData = { ...data, senderId, receiverId, date: new Date() }
    socket.emit('private-message', messagesData)
    setMessage([...message, messagesData])
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
  return (
    <div>
      <h3>
        {messages}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          send message
        <input name='message' type='text'
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
