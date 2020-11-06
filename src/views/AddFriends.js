import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const AddFriends = () => {
  const history = useHistory();
  
  if(!localStorage.getItem('token')){
    history.push('/login')
  }

  const [myFriends, SetMyFriends] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [reload, setReload ] = useState(false)

  useEffect(() => {
    axios.get('/v1/getAllUser', {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      const { allUsers } = response.data
      setAllUsers(allUsers)
    }).catch((error) => {
      console.log(error);
    })

    axios.get('/v1/friends', {
      "headers": {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      const { friends } = response.data
      SetMyFriends(friends)
    })
      .catch((error) => {
        console.log(error);
      })
  }, [reload])

  const addAsFriend = (data) => {
    let state = { _id: data }
    axios.post('/v1/addAsFriend', state, {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response);
      setReload(!reload)
    }).catch((error) => {
      console.log(error);
    })
  }

  const removeFriend = (data) => {
    axios.delete(`/v1/removeFriend/${data}`, {
      'headers': {
        "Content-Type": "application/json",
        "token": localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response);
      setReload(!reload)
    }).catch((error) => {
      console.log(error);
    })
  };

  let addNewFriends;
  let friends = myFriends.map((items, index) => {
    return items.username;
  })

  console.log(reload);

  if (allUsers.length > 0) {
    addNewFriends = allUsers.map((items, index) => {

      return (
        <Fragment key={index}>
          <ul>
            <li>
              {items.username}
            </li>
            <button disabled={friends.includes(items.username)}
              onClick={() => addAsFriend(items._id)}
              className={friends.includes(items.username) ? 
                'bg-red-200  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                :
                'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              }
            >Add</button>
            <button disabled={!friends.includes(items.username)}
              onClick={() => removeFriend(items._id)}
              className={
                !friends.includes(items.username) ? 
                'bg-red-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' 
                : 
                'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                
              }
            >Remove</button>
          </ul>
        </Fragment>
      )
    })
  }
  return (
    <div>
      <div>
        all Users: {addNewFriends}
      </div>
    </div>
  )
}

export default AddFriends
