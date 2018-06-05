import React, { Component, PropTypes } from 'react'
import fetch from '../../decorators/Fetch'
import Sidebar from '../../components/Sidebar'
import ListItem from '../../components/ListItem'
import ListGroup from '../../components/ListGroup'
import s from './ServicePage.scss'

@fetch
export default class ServicePage extends Component {

	static contextTypes = {
		serviceName: React.PropTypes.func,
		menu: React.PropTypes.func
	}

	render() {

		const serviceId = this.props.params.serviceId

		return (
			<div className={s.root}>
				<Sidebar>
					<ListGroup title={this.context.serviceName(serviceId)}>
						<ListItem name='概览' href={`service/${serviceId}/overview`} hidden={!this.context.menu(serviceId).summary} actived={true} />
						<ListItem name='API说明' href={`service/${serviceId}/api`} hidden={!this.context.menu(serviceId).apidoc} />
						<ListItem name='服务状态' href={`service/${serviceId}/status`} hidden={!this.context.menu(serviceId).status} />
						<ListItem name='服务管理' href={`service/${serviceId}/mgnt`} hidden={!this.context.menu(serviceId).control} />
						<ListItem name='服务日志' href={`service/${serviceId}/logs`} hidden={!this.context.menu(serviceId).logs} />
						<ListItem name='资源使用' href={`service/${serviceId}/services`} hidden={!this.context.menu(serviceId).resource} />
						<ListItem name='服务首页' href={`service/${serviceId}/entry`} hidden={!this.context.menu(serviceId).entry} />
						<ListItem name='服务注册' href={`service/${serviceId}/register`} hidden={!this.context.menu(serviceId).register} />
					</ListGroup>
				</Sidebar>
				<div id="content" className={s.content}>
					{this.props.children}
				</div>
			</div>
		)		
	}
}
