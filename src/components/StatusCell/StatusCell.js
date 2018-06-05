import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './StatusCell.scss'

export default class StatusCell extends Component {

	static propTypes = {
		status: PropTypes.number
	}

	static defaultProps = {
		status: 0 /* 0: offline, 1: 0k, 2: ng, 3: ... */
	}

	render() {

		return (
			<td className={classnames(s.cell, {[s.offline] : this.props.status === 0,
											   [s.ok] : this.props.status === 1,
											   [s.ng] : this.props.status === 2})}>
				<i className={classnames('fa', 'fa-lg', {'fa-question-circle': this.props.status === 0,
														 'fa-check-circle': this.props.status === 1,
														 'fa-minus-circle': this.props.status === 2})} aria-hidden="true"></i>
			</td>
		)
	}
}