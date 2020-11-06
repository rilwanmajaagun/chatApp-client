import React, { useState, useEffect} from 'react'
import Pusher from 'pusher-js';
import axios from 'axios'

const Push = () => {
  const [message, setMessage] = useState()
 useEffect(()=> {
  //  axios.get('/message')
  //  .then((response)=> {
  //   console.log(response);
  //  }).catch((error) => {
  //    console.log(error);
  //  })
   Pusher.logToConsole = true;
  const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  })
  const channel = pusher.subscribe('chat');
  channel.trigger('client-message')
  channel.bind('message', data => {
  console.log("Push -> data", data)
    // setMessage(data);
  });
 })
  return (
    <div>
      {message}
    </div>
  )
}

export default Push
