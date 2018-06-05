import React, {	Component, PropTypes } from 'react'
import classnames from 'classnames'
import Service from '../DbService' 
import s from './DbGroup.scss'

export default class DbGroup extends Component {

	static propTypes = {
		title: PropTypes.string,
		services: PropTypes.array,
		notitle: PropTypes.bool
	}

	static defaultProps = {
		title: 'UNKNOWN',
		services: [],
		notitle: false
	}

	render() {
		return (
			<div className={s.root}>
				<div className={classnames(s.title, {[s.hide]: this.props.notitle})}>{this.props.title}</div>
				<div className={s.panel}>
					{
						this.props.services.map(service => {
							return <Service key={service.id} icon={service.icon} name={service.name} href={service.href} status={service.status} />
						})
					}
				</div>
			</div>
		)
	}
}
