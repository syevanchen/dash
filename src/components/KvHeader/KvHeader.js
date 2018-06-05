import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './KvHeader.scss';

export default class KvHeader extends Component {

	static propTypes = {
		name: PropTypes.string.isRequired
	}

	render() {

		return (
			<thead>
				<tr className={s.root}>
					<th colSpan="2" className={s.th}>{this.props.name}</th>
				</tr>
			</thead>
		)
	}
}
