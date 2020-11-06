import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'


const Room = () => {
  const [room, setRoom] = useState()
  const [name, setName] = useState()
  const [rooms, setRooms] = useState([])
  const history = useHistory();

  if (!localStorage.getItem('token')) {
    history.push('/lo')
  }

  useEffect(() => {
    axios.get('/v1/getUser', {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      const { username } = response.data.data
      setName(username)
    }).catch((error) => {
      console.log(error);
    })

    axios.get('v1/rooms')
      .then((response) => {
        const { data } = response.data
        setRooms(data)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])
  let Rooms;
  if (rooms.length > 0) {
    Rooms = rooms.map((items, index) => {
      return (
        <Fragment key={index}>
          <ul>
            <li>
          <Link to={`/chat?name=${name}&room=${items.roomName}`}>{items.roomName}</Link>
            </li>
          </ul>
        </Fragment>
      )
    })
  }
  return (
    <div>
      <h4>
        Create A New room
      </h4>
      <form>
        <input type='text' name='room' placeholder='Room' onChange={(event) => setRoom(event.target.value)} />
        <Link
          onClick={event => (!room) ? event.preventDefault() : null}
          to={`/chat?name=${name}&room=${room}`}>
          <button type='submit'>
            Join
        </button>
        </Link>
      </form>
      <h4>join existing Rooms</h4>
      <h3>{Rooms}</h3>
    </div>
  )
}

export default Room
