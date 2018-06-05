import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import ListGroup2 from '../ListGroup2'
import s from './ListBox.scss'

export default class ListBox extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		groups: PropTypes.arrayOf(PropTypes.shape({
			title: PropTypes.string.isRequired,
			items:  PropTypes.arrayOf(PropTypes.shape({
				date: PropTypes.string,
				message: PropTypes.string,
				detail: PropTypes.string
			}))
		}))
	}

	static defaultProps = {
		title: '产品功能和升级',
		groups: []
	}

	render() {

		return (
			<div className={s.root}>
				<div className={s.title}>
					{this.props.title}
				</div>
				<div className={s.list}>
					{
						this.props.groups.map(group => {
							return (
								<dl key={group.title} className={s.content}>
									<dt>{group.title}</dt>
									<dd>
										<ListGroup2 items={group.items} />
									</dd>
								</dl>
							)
						})
					}
				</div>
			</div>
		)
	}
}