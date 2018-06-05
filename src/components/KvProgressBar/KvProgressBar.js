import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './KvProgressBar.scss'

export default class KvProgressBar extends Component {

	static propTypes = {
		data: PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
			max: PropTypes.number.isRequired
		})
	};

	static defaultProps = {
		data: {
			label: '',
			value: 1,
			max: 1
		}
	};

	render() {

		let width = {
			width: `${Math.floor((this.props.data.value * 100) / this.props.data.max)}%`
		}

		return (
			<tr className={s.row}>
				<td colSpan="2" className={s.cell}>
					<div className={s.label}>{this.props.data.label}</div>
					<div className={s.bar}>
						<div className={s.line} />
						<div style={width} className={s.progress}>{width.width}</div>
					</div>
				</td>
			</tr>
		)
	}
}