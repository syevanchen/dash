import React from 'react'
import { Router, hashHistory } from 'react-router'
import { render } from 'react-dom'
import App from './components/App'
import Dashboard from './pages/Dashboard'
import './styles/main.scss'

const routes = {
  path: '/',
  component: App,
  indexRoute: {	component: Dashboard },
  childRoutes: [
    require('./pages/ServicePage')
  ]  
}

render(
  <Router history={ hashHistory } routes={ routes } />,
  document.getElementById('root')
)
