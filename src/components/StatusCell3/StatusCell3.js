import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './StatusCell3.scss'

export default class StatusCell3 extends Component {

	static propTypes = {
		status: PropTypes.string
	}

	static defaultProps = {
		status: 'unknown' /* unknown, passing, critical */
	}

	render() {

		return <td className={s.cell}>
			<span className={classnames(s.label, s[this.props.status])}>{this.props.status}</span>
		</td>
	}
}