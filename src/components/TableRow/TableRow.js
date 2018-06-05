import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import TextCell from '../TextCell'
import StatusCell from '../StatusCell'
import StatusCell2 from '../StatusCell2'
import StatusCell3 from '../StatusCell3'
import ButtonCell from '../ButtonCell'
import LinkCell from '../LinkCell'
import Button from '../Button'
import s from './TableRow.scss'

export default class TableRow extends Component {

	static propTypes = {
		data: PropTypes.arrayOf(PropTypes.shape({
			type: PropTypes.number,
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			status: PropTypes.number,
			name: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
			handle: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
			link: PropTypes.string
		}))
	};

	static defaultProps = {
		data: []
	};

	render() {

		return (
			<tr className={s.row}>
			{this.props.data.map((data, idx) => {
				switch(data.type) {
				case 2:
					return <StatusCell key={idx} status={data.status} />
				case 3:
					return 	<ButtonCell key={idx}>
								{Array.isArray(data.name) ? 
									data.name.map((name, index) => {
										return <Button key={index} handle={data.handle[index]}>{name}</Button>		
									}) 
								: <Button handle={data.handle}>{data.name}</Button>}
						   	</ButtonCell>
				case 5:
					return <StatusCell2 key={idx} status={data.status} />
				case 6:
					return <StatusCell3 key={idx} status={data.value} />
				case 7:
					return <LinkCell key={idx} value={data.value} link={data.link} />
				case 1:
				default:
					return <TextCell key={idx} value={data.value} />
				}
			})}
			</tr>
		)
	}
}