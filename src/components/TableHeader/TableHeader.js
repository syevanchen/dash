import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import s from './TableHeader.scss';

export default class TableHeader extends Component {

	static propTypes = {
		data: PropTypes.arrayOf(PropTypes.shape({
				name: PropTypes.string.isRequired,
				align: PropTypes.string
			}))
	}

	render() {

		return (
			<thead>
				<tr className={s.root}>
					{this.props.data.map(data => {
						return <th key={data.name} className={classnames(s.th, (data.align ? s[data.align] : s.left))}>{data.name}</th>
					})}
				</tr>
			</thead>
		)
	}
}
