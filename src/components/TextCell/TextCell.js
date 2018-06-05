import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './TextCell.scss'

export default class TextCell extends Component {

	static propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}

	static defaultProps = {
		value: ''
	}

	render() {

		return (
			<td className={s.cell}>{this.props.value}</td>
		)
	}
}