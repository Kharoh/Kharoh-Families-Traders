import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Logo from '../Svgs/Logo'

import './Main.css'

class Main extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div id='Main' className='main page'>
        <header>
          <div className='topBar'>
            <div className='leftBar' />
            <div className='rightBar' />
          </div>
          <div className='mainHeader'>
            <Logo fill='#fff' />
            <h1 className='title'>Kharoh Families</h1>
            <h2 className='subtitle'>Etre chevalier dans la vraie vie c'est pour les nuls. Venez faire couler le sang !</h2>
          </div>
        </header>

        <div className='crossHeader'>
          <h3>A l'attaque !</h3>
          <p>
            Ton village a besoin de toi.
            Ici, tu vas pouvoir être utile, de la fabrication aux batailles en passant par les cultures et le commerce !
            Tu vas pouvoir tout faire! ( Enfin.. pas encore enterrer ton professeur de français ). <br />
            Choisis <strong>ton</strong> rôle et <strong>ta</strong> <strike>note au devoir commun</strike> vocation dans ce rpg d'une nouvelle ère !
          </p>
          <div className='registerBox'>
            {
              this.props.isAuthed
                ? <Link to='/dashboard'>
                  <button className='action-button'>Passer à l'action</button>
                  </Link>
                : <a href='https://discordapp.com/api/oauth2/authorize?response_type=token&client_id=520304790106800143&state=15773059ghq9183habn&scope=identify'>
                  <button className='action-button'>Passer à l'action</button>
                  </a>
            }
          </div>
        </div>

        <div className='presentation1' />

        <div className='presentation2' />

        <footer />

      </div>
    )
  }
}

export default Main
