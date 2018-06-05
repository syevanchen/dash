import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import ContentHeader from '../../../../components/ContentHeader'
import Table from '../../../../components/Table'
import s from './Status.scss'

const TABLE_HEADER = [
	{ name: '实例ID' },
	{ name: '健康状况',
	  align: 'center' },
	{ name: '所在区域' },
	{ name: '服务地址' },
	{ name: '启动时间' },
	{ name: '程序包' },
	{ name: '版本信息' },
	{ name: '类型' },	
	{ name: '详细信息',
	  align: 'center' }
]

@fetch
export default class Status extends Component {

	static contextTypes = {
		router: PropTypes.shape({
			push: PropTypes.func.isRequired
		})
	}

	@autobind
	fetch(data) {
		this.setState({ data: data })
	}

	state = {
		data: {
			serviceName: '',
			serviceStatus: '',
			serviceInstances: []
		}
	}

	constructor(props) {
		super(props)
		props.fetch(`/api/v1/service/runtime/${props.params.serviceId}`, this.fetch)()
	}

	render() {

		const data = {
			header: TABLE_HEADER,
			content: []
		}

		data.content = this.state.data.serviceInstances.map(instance => {
			return [
				{
					type: 1,
					value: instance.serviceId
				},{
					type: 2,
					status: instance.status == 'UP' ? 1 : (instance.status == 'DOWN' ? 2 : 0)
				},{
					type: 1,
					value: instance.dataCenter
				},{
					type: 1,
					value: instance.host
				},{
					type: 1,
					value: instance.upTime
				},{
					type: 1,
					value: instance.excutableImage
				},{
					type: 1,
					value: instance.version
				},{
					type: 1,
					value: instance.type
				}, {
					type: 3,
					name: '详细信息',
					handle: (e) => {
						this.context.router.push(`service/${this.props.params.serviceId}/status/instance/${instance.serviceId}`)
					}
				}
			]
		})

		return this.props.children || (
			<div className={s.root}>
				<ContentHeader name={this.state.data.serviceName} 
							   status={this.state.data.serviceStatus} 
							   handle={this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)}></ContentHeader>
				<div className={s.content}>
					<Table data={data}></Table>
				</div>
			</div>
		)
	}
}
