import React from 'react'

import Logo from '../Svgs/Logo'

import './Not.css'

function NotConnected () {
  return (
    <div id='NotConnected'>
      <Logo />
      <div className='error-container'>
        <h1>Vous n'êtes pas connecté(e)</h1>
      </div>
      <a href='https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=520304790106800143&state=15773059ghq9183habn&scope=identify'>
        <button>Se connecter</button>
      </a>
    </div>
  )
}

export default NotConnected
