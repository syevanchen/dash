import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './LinkCell.scss'

export default class LinkCell extends Component {

	static propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		link: PropTypes.string
	}

	static defaultProps = {
		value: '',
		link: '#'
	}

	render() {

		return (
			<td className={s.cell}><a className={s.link} href={this.props.link}>{this.props.value}</a></td>
		)
	}
}