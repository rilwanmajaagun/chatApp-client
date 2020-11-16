import React, { useState, useEffect} from 'react'
import { useForm } from "react-hook-form"
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import  socketConnection from '../Connection'


const Login = () => {
  const history = useHistory();
  const {register, handleSubmit} = useForm();
  const [username, setUsername ] = useState()
  const [userId, setUserId] = useState()
  const [logged, setLogged ] = useState(false)
  
  useEffect(() => {
    socketConnection.emit('userName.isOnline', username)
    socketConnection.emit('logged-in', userId)

  }, [logged, userId, username])

  const onSubmit = (data) => {
    axios.post('/v1/login', data)
    .then((response) => {
      localStorage.setItem('token', response.data.token)
      setUsername(response.data.username)
      setUserId(response.data.id)
      setLogged(true)
    }).catch((error) => {
      console.log(error);
    })
  }
  if(logged === true) {
    history.push('/')
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email
        <input name='email' type='text'
        ref={register}/>
        </label>
        <label>
          Password
        <input name='password' type='password'
         ref={register}/>
          </label>
          <button type='submit'>
            Login
          </button>
      </form>
    </div>
  )
}

export default Login
