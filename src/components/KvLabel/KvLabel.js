import React, {	Component, PropTypes } from 'react'
import s from './KvLabel.scss'

export default class KvLabel extends Component {

	static propTypes = {
		value: PropTypes.string.isRequired
	}

	static defaultProps = {
		value: 'UNSPECIFIED'
	}

	render() {

		return (
			<td className={s.cell}>{`${this.props.value}：`}</td>
		)
	}
}