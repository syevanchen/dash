import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './KvStatus.scss'

export default class KvStatus extends Component {

	static propTypes = {
		value: PropTypes.string.isRequired
	}

	static defaultProps = {
		value: 'OFFLINE'
	}

	render() {

		let statusClassName = s.offline
		switch(this.props.value) {
		case 'UP':
			statusClassName = s.up
			break
		case 'DOWN':
			statusClassName = s.down
			break			
		case 'PAUSE': // pause
			statusClassName = s.pause
			break
		default: // unknown
			// empty
		}

		return (
			<td className={classnames(s.cell, statusClassName)}>{this.props.value}</td>
		)
	}
}