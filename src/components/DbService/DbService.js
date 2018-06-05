import React, {	Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import s from './DbService.scss'

export default class DbService extends Component {

	static propTypes = {
		icon: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		href: PropTypes.string.isRequired,
		status: PropTypes.string
	}

	static defaultProps = {
		icon: 'cogs',
		name: 'UNKNOWN',
		href: '#',
		status: 'UNKNOWN'
	}

	render() {
		return (
			<Link className={s.root} to={`service/${this.props.href}`}>
				<div className={classnames(s.icon, {[s.up]: this.props.status === 'UP', [s.down]: this.props.status === 'DOWN'})}>
					<i className={classnames('fa', 'fa-3x', `fa-${this.props.icon}`)} aria-hidden="true"></i>
				</div>
				<div className={s.name}>{this.props.name}</div>
			</Link>
		)
	}
}
