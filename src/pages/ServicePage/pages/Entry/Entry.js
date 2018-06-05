import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import s from './Entry.scss'

@fetch
export default class Entry extends Component {

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
		props.fetch(`/api/v1/service/entry/${this.props.params.serviceId}`, this.fetch)()
	}

	render() {

		return	<div className={s.root}>
					<iframe src={this.state.data.type === 'swagger' ? `/swagger-ui/index.html?url=${this.state.data.url}` : this.state.data.url} className={s.content} />
				</div>
	}
}