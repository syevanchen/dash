import React from 'react'
import 'whatwg-fetch'
import autobind from 'autobind-decorator'

const Fetch = ComposedComponent => class extends React.Component {

	static contextTypes = {
		accessToken: React.PropTypes.string,
		tokenType: React.PropTypes.string,
		login: React.PropTypes.func
	}

	/* 
		TYPE1: fetch(url, callback)
		TYPE2: fetch(url, callback, data)
		TYPE2: fetch(url, callback, data, method)
	 */
	@autobind
	fetch(url, callback, ...data) {

		// method = GET
		if (data.length < 1) {
			return () => {
				fetch(url, {
					credentials: 'same-origin',
					headers: {
						'Authorization': `${this.context.tokenType} ${this.context.accessToken}`
					}
				}).then(function(response) {
					if (response.status === 401) {
						this.context.login()
						throw 'Authentication Required'
					} else {
						return response.json()
					}
				}.bind(this)).then(callback).catch(function(ex) {
					console.log('error!', ex)
				})
			}
		}

		// method = POST, PUT, ...
		return () => {
			fetch(url, {
				credentials: 'same-origin',
				method: data[1] || 'POST',
				headers: {
    				'Accept': 'application/json',
    				'Content-Type': 'application/json',
    				'Authorization': `${this.context.tokenType} ${this.context.accessToken}`
  				},
  				body: JSON.stringify(data[0])
			}).then(function(response) {
					if (response.status === 401) {
						this.context.login()
						throw 'Authentication Required'
					} else {
						return response.json()
					}
			}.bind(this)).then(callback).catch(function(ex) {
				console.log('error!', ex)
			})
		}
	}

	render() {
		return <ComposedComponent {...this.props} fetch={this.fetch} />
	}
}

export default Fetch