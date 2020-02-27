import React from 'react'

import Logo from '../Svgs/Logo'

import './Not.css'

function NotFound () {
  return (
    <div id='NotFound'>
      <Logo />
      <div class='error-container'>
        <h1>Error 404 : page not found</h1>
      </div>
    </div>
  )
}

export default NotFound
