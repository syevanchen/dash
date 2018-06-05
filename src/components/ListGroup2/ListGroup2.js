import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import ListItem2 from '../ListItem2'
import s from './ListGroup2.scss'

export default class ListGroup2 extends Component {

	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.shape({
			date: PropTypes.string,
			message: PropTypes.string,
			detail: PropTypes.string
		}))
	}

	static defaultProps = {
		items: []
	}

	render() {

		return (
			<ul className={s.monthlist}>
				{
					this.props.items.map((item, index) => {
						return <ListItem2 key={index} date={item.date} message={item.message} detail={item.detail} />
					})
				}
			</ul>
		)
	}
}