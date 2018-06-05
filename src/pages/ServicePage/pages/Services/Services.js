import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import TabsHeader from '../../../../components/TabsHeader'
import Table from '../../../../components/Table'
import s from './Services.scss'

const TABS = [
	{ title: '服务清单', 	href: '' },
	{ title: '资源节点', 	href: '' }
]

const TABLE_HEADER = [
	{ name: '服务ID' },
	{ name: '实例数量'},
	{ name: '所在区域' },
	{ name: 'CPUS' },
	{ name: '内存' },
	{ name: '磁盘' },
	{ name: '程序包' },
	{ name: '容器' }
]

@fetch
export default class Services extends Component {

	@autobind
	fetch(data) {
		this.setState({ apps: data.apps })
	}

	state = {
		apps: []
	}

	constructor(props) {
		super(props)
		TABS[0].href=`service/${props.params.serviceId}/services`
		TABS[1].href=`service/${props.params.serviceId}/nodes`
	}

	componentDidMount() {
		this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/apps`, this.fetch)()
	}

	render() {

		const data = {
			header: TABLE_HEADER,
			content: []
		}

		data.content = this.state.apps.map(service => {
			return [
				{
					type: 1,
					value: service.name
				},{
					type: 1,
					value: service.instances
				},{
					type: 1,
					value: ''
				},{
					type: 1,
					value: service.cpus
				},{
					type: 1,
					value: service.mem
				},{
					type: 1,
					value: service.disk
				},{
					type: 1,
					value: service.image
				},{
					type: 1,
					value: service.container
				}
			]
		})

		return (
			<div className={s.root}>
				<TabsHeader name={this.props.params.serviceId} 
							reloadHandler={this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/apps`, this.fetch)}
							tabs={TABS} />
				<div className={s.content}>
					<Table data={data}></Table>
				</div>
			</div>
		)
	}
}
