import React from 'react'
import {Link} from 'react-router-dom'
import './style.css'
function Navigation() {
  return (
    <div className='navbar'>
      <div className='brand'>BUJO</div>
      <div className='main-nav'>
        <ul>
          <li><Link to='/'>Login</Link></li>
          <li><Link to='/signup'>Signup</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navigation