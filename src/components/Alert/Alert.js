import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './Alert.scss'

export default class Alert extends Component {

	static propTypes = {
		message: PropTypes.string
	}

	static defaultProps = {
		message: ''
	}

	render() {
		return 	<div className={classnames(s.root, {[s.hide]: this.props.message.length < 1})}>
					{this.props.message}
				</div>
	}
}