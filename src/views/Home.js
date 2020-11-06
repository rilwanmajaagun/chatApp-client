import React from 'react'
import { Link, useHistory } from 'react-router-dom'

const Home = () => {

  const history = useHistory();
  
  if(!localStorage.getItem('token')){
    history.push('/login')
  }
  
  return (
    <ul>
      <li>
      <Link to='/generalMessage'>General</Link>
      </li>
      <li>
     <Link to='/addFriends'>Add new Friends</Link>
      </li>
      <li>
     <Link to='/room'>Join Room</Link>
      </li>
      <li>
     <Link to='/friends'>Chat with friends</Link>
      </li>
    </ul>
  )
}

export default Home
