import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import socketIOClient from 'socket.io-client'
import Cookies from 'js-cookie'
import assets from './assets/assets'

import './App.css'

import DataContext from './Data'

import Main from './components/Main/Main'
import Dashboard from './components/Dashboard/Dashboard'
import NotConnected from './components/Errors/NotConnected'
import NotFound from './components/Errors/NotFound'

class App extends Component {
  constructor () {
    super()
    this.state = {
      assets,
      socket: socketIOClient('http://127.0.0.1:4001'),
      isAuthed: false,
      userID: {},
      userInfos: {}
    }
  }

  componentDidMount () {
    // retrieve the socket object
    const socket = this.state.socket

    // when the server send us a new session ID for any reason, we are going to store it in the cookies
    socket.on('newSessionID', data => {
      Cookies.set('sessionID', data.sessionID, { expires: 7 }) // store it for 7 days
      socket.emit('sessionIDCookie', Cookies.get('sessionID')) // send the new session ID to the server
    })

    // when the component mounts if we have a session ID in our cookie we will send it to the server
    if (Cookies.get('sessionID')) socket.emit('sessionIDCookie', Cookies.get('sessionID'))

    // if there is a connection token from discord in the url that means that the user just connected so we send the event to the server
    var urlParams = new URLSearchParams(window.location.hash.replace('#', '?'))
    var token = urlParams.get('access_token')
    if (token) {
      socket.emit('connectedWithDiscord', { token, sessionID: Cookies.get('sessionID') })
    }

    // when the server grants our connection we set isAuthed to true to display authed components and we can store the userID from discord
    socket.on('authed', ID => {
      this.setState({
        isAuthed: true,
        userID: ID
      })
      document.location.hash = '' // used to remove discord hash infos after auth
      console.log(ID)
    })

    // handle new userInfos received from the server and log them
    socket.on('userInfos', infosObject => {
      if (infosObject.type) { // if the data received contain a type, we only replace the type value in the userInfos object client side
        this.state.userInfos[infosObject.type] = infosObject.data
      } else { // if it doesn't contain any type, we assume that the server sent the whole userInfos object and replace every keys
        for (const key in infosObject) {
          this.state.userInfos[key] = infosObject[key]
        }
      }
      this.setState({}) // use this to refresh the App component
      console.log(this.state.userInfos)
    })
  }

  render () {
    return (
      <DataContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route
              exact path='/'
              render={() => <Main isAuthed={this.state.isAuthed} />}
            />

            <Route
              path='/dashboard'
              render={() => this.state.isAuthed ? <Dashboard /> : <NotConnected />}
            />

            <Route component={NotFound} />
          </Switch>
        </Router>
      </DataContext.Provider>
    )
  }
}

export default App
