import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import KvHeader from '../KvHeader'
import KvRow from '../KvRow'
import KvProgressBar from '../KvProgressBar'
import s from './KvList.scss';

export default class KvList extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		data: PropTypes.arrayOf(PropTypes.shape({
			type: PropTypes.number,
			label: PropTypes.string.isRequired,
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			align: PropTypes.string,
			max: PropTypes.number
		}))
	};

	static defaultProps = {
		data: {
			title: 'UNSPECIFIED',
			data: []
		}
	};

	render() {
		return (
			<table className={s.root}>
				<KvHeader name={this.props.title} />
				<tbody>
					{this.props.data.map((data, idx) => {
						if (data.type == 3) {
							return <KvProgressBar key={idx} data={data} />
						} else {
							return <KvRow key={idx} data={data} />
						}
					})}
				</tbody>
			</table>
		)
	}
}
