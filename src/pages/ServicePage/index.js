module.exports = {
  path: 'service/:serviceId',
  component: require('./ServicePage').default,
   indexRoute: { onEnter: ({params}, replace) => replace(`service/${params.serviceId}/overview`) },
  childRoutes: [
  		 require('./pages/Overview'),
  		 require('./pages/API'),
         require('./pages/Status'),
         require('./pages/Management'),
         require('./pages/Logs'),
         require('./pages/Services'),
         require('./pages/Nodes'),
         require('./pages/Entry'),
         require('./pages/Register')
  ]
}