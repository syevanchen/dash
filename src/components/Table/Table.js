import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TableHeader from '../TableHeader'
import TableRow from '../TableRow'
import s from './Table.scss';

export default class Table extends Component {

	static propTypes = {
		data: PropTypes.shape({
			header: PropTypes.arrayOf(PropTypes.shape({
				name: PropTypes.string,
				align: PropTypes.string
			})),
			content: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
				type: PropTypes.number,
				value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				status: PropTypes.number,
				name: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
				handle: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)])
			})))
		})
	};

	static defaultProps = {
		data: {
			header: [],
			content: []
		}
	};

	render() {
		return (
			<table className={s.root}>
				<TableHeader data={this.props.data.header} />
				<tbody>
					{this.props.data.content.map((data, idx) => {
						return <TableRow key={idx} data={data} />
					})}
				</tbody>
			</table>
		)
	}
}
