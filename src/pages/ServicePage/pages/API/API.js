import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import s from './API.scss'

@fetch
export default class API extends Component {

	state = {
		data: {
			type: 'swagger',
			url: ''
		}
	}

	@autobind
	fetch(data) {
		this.setState({
			data: data
		})
	}

	constructor(props) {
		super(props)
		props.fetch(`/api/v1/service/apidoc/${this.props.params.serviceId}`, this.fetch)()
	}

	render() {

		return	<div className={s.root}>
					<iframe src={this.state.data.type === 'swagger' ? `/swagger-ui/index.html?url=${this.state.data.url}` : this.state.data.url} className={s.content} />
				</div>
	}
}