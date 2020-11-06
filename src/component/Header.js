import React, { Component } from 'react'
import {Link } from 'react-router-dom'

export class Header extends Component {
  render() {
    return (
      <div>
        <nav className='bg-blue-100'>
          <ul className='flex justify-between'>
            <li className="text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white">
              <Link to='/'>Home</Link> 
            </li>
            <li className="text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white">
            <Link to='/login'>Login</Link> 
            </li>
            <li className="text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white">
            <Link to='/signup'>SignUp</Link> 
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Header
