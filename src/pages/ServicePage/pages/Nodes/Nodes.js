import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import TabsHeader from '../../../../components/TabsHeader'
import Table from '../../../../components/Table'
import s from './Nodes.scss'

const TABS = [
	{ title: '服务清单', 	href: '' },
	{ title: '资源节点', 	href: '' }
]

const TABLE_HEADER = [
	{ name: '服务ID' },
	{ name: '实例ID'},
	{ name: '所在区域' },
	{ name: 'CPUS' },
	{ name: '内存' },
	{ name: '磁盘' },
	{ name: '端口' },
	{ name: '容器' },
	{ name: '运行时间' }
]

@fetch
export default class Nodes extends Component {

	@autobind
	fetch(data) {
		this.setState({ nodes: data.node })
	}

	state = {
		nodes: []
	}

	constructor(props) {
		super(props)
		TABS[0].href=`service/${props.params.serviceId}/services`
		TABS[1].href=`service/${props.params.serviceId}/nodes`
	}

	componentDidMount() {
		this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/tasks`, this.fetch)()
	}

	render() {

		return (
			<div className={s.root}>
				<TabsHeader name={this.props.params.serviceId} 
							reloadHandler={this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/apps`, this.fetch)}
							tabs={TABS} />
				<div className={s.content}>
					{this.state.nodes.map(node => {
						return (
							<section key={node.hostName} className={s.block}>
								<div className={s.header}>节点：{node.hostName}（{node.address}）</div>
								<Table data={{
									header: TABLE_HEADER,
									content: node.tasks.map(task => {
										return [
											{
												type: 1,
												value: task.serviceName
											},{
												type: 1,
												value: task.serviceID
											},{
												type: 1,
												value: task.dataCenter
											},{
												type: 1,
												value: task.cpus
											},{
												type: 1,
												value: task.mem
											},{
												type: 1,
												value: task.disk
											},{
												type: 1,
												value: task.ports
											},{
												type: 1,
												value: task.container
											},{
												type: 1,
												value: task.upTime
											}
										]
									})
								}}></Table>
							</section>
						)
					})}
				</div>
			</div>
		)
	}
}
