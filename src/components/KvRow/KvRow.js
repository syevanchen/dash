import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import KvLabel from '../KvLabel'
import KvValue from '../KvValue'
import KvStatus from '../KvStatus'
import s from './KvRow.scss'

export default class KvRow extends Component {

	static propTypes = {
		data: PropTypes.shape({
			type: PropTypes.number,
			label: PropTypes.string.isRequired,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			align: PropTypes.string,
			max: PropTypes.number
		})
	};

	static defaultProps = {
		data: {}
	};

	render() {

		return (
			<tr className={s.row}>
				<KvLabel value={this.props.data.label} />
				{((type) => {
				switch(type) {
				case 1:
					return <KvValue value={this.props.data.value} align={this.props.data.align} />
				case 2:
					return <KvStatus value={this.props.data.value} />
				default:
					return <td colSpan="2"></td>
				}})(this.props.data.type)}
			</tr>
		)
	}
}