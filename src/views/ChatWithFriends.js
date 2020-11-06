import React, { useState, useEffect, Fragment } from 'react'
import {Link } from 'react-router-dom';
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const ChatWithFriends = () => {

  const history = useHistory();
  
  if(!localStorage.getItem('token')){
    history.push('/login')
  }

  const [senderId, setSenderId ] = useState()
  const [friends, setFriends ] = useState([])
  const [senderName, setSenderName ] = useState()

  useEffect(()=> {
    axios.get('/v1/getUser', {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      const {id, username } = response.data.data
      setSenderId(id)
      setSenderName(username)
    }).catch((error)=> {
      console.log(error);
    })
  },[senderId])

  useEffect(() => {
    axios.get('/v1/friends', {
      "headers": {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      const { friends } = response.data
      setFriends(friends)
    })
    .catch((error) => {
      console.log(error);
    })
  },[])

 
  let yourFriends;
  if(friends.length > 0){
    yourFriends = friends.map((items, index) => {
      return (
        <Fragment key={index}> 
        <ul>
          <li>
          <Link to={`/private?senderId=${senderId}&receiverId=${items._id}&senderName=${senderName}&receiverName=${items.username}`}>
            {items.username}
            </Link>
          </li>
        </ul>
        </Fragment>
      )
    })
  }
  return (
    <div>
    <div>Your friends:{yourFriends}</div> 
    </div>
  )
}

export default ChatWithFriends
