import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import Group from '../DbGroup'
import s from './DbPlatform.scss'

export default class DbPlatform extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		groups: PropTypes.array
	}

	static defaultProps = {
		title: 'UNKNOWN',
		groups: []
	}

	render() {
		return (
			<div className={s.root}>
				<div className={s.title}>{this.props.title}</div>
				{
					this.props.groups.map((group, index, groups) => {
						return <Group key={group.id} title={group.title} services={group.services} notitle={groups.length < 2}></Group>
					})
				}
			</div>
		)
	}
}
