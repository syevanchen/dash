import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './KvValue.scss'

export default class KvValue extends Component {

	static propTypes = {
		value: PropTypes.any.isRequired,
		align: PropTypes.string
	}

	static defaultProps = {
		value: 'UNSPECIFIED',
		align: 'right'
	}

	render() {

		return (
			<td className={classnames(s.cell, s[this.props.align])}>{this.props.value}</td>
		)
	}
}