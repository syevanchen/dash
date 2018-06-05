import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './StatusCell2.scss'

export default class StatusCell2 extends Component {

	static propTypes = {
		status: PropTypes.number
	}

	static defaultProps = {
		status: 0 /* 0: offline, 1: running, 2: stop, 3: fault, ... */
	}

	render() {

		return (
			<td className={s.cell}>
				<span className={s.label}>{
					(() => {
						switch(this.props.status) {
						case 1:
							return '运行中'
						case 2:
							return '停止'
						case 3:
							return '故障中'
						default:
							return '离线'
						}
					})()
				}</span>
				<i className={classnames('fa', 'fa-lg', 'fa-cogs', {[s.offline] : this.props.status === 0,
											   			            [s.running] : this.props.status === 1,
											   			            [s.stop] : this.props.status === 2,
											   			            [s.fault] : this.props.status === 3})} aria-hidden="true"></i>
			</td>
		)
	}
}