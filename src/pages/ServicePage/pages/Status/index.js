module.exports = {
  path: 'status',
  component: require('./Status').default,
  childRoutes: [
  		require('./pages/Instance'),
  		require('./pages/Env'),
  		require('./pages/Log')
  ]  
}