import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../../../decorators/Fetch'
import TabsHeader from '../../../../../../components/TabsHeader'
import KvList from '../../../../../../components/KvList'
import s from './Instance.scss'

const TABS = [
	{
		title: '详细信息',
		href: ''
	},{
		title: '环境与配置',
		href: ''
	},{
		title: '日志',
		href: ''
	}
]

@fetch
export default class Instance extends Component {

	static contextTypes = {
		router: PropTypes.shape({
			push: PropTypes.func.isRequired
		})
	}

	fetch(name) {
		return (data) => {
			this.setState({ data: Object.assign(this.state.data, { [name]: data })})
		}
	}

	state = {
		data: {}
	}

	constructor(props) {
		super(props)
		TABS[0].href=`service/${props.params.serviceId}/status/instance/${props.params.instanceId}`
		TABS[1].href=`service/${props.params.serviceId}/status/env/${props.params.instanceId}`
		TABS[2].href=`service/${props.params.serviceId}/status/log/${props.params.instanceId}`		
		// this.reload()
	}

	componentDidMount() {
		this.reload()
	}

	@autobind
	reload() {
		this.props.fetch(`/api/v1/instance/info/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('info'))()
		this.props.fetch(`/api/v1/instance/health/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('health'))()
		this.props.fetch(`/api/v1/instance/metrics/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('metrics'))()
		this.props.fetch(`/api/v1/instance/memory/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('memory'))()
		this.props.fetch(`/api/v1/instance/jvm/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('jvm'))()		
	}

	render() {

		let info = this.state.data.info ? [
			{
				type: 1,
				label: 'IP地址',
				value: this.state.data.info.host,
				align: 'right'
			},{
				type: 1,
				label: '程序版本',
				value: this.state.data.info.version,
				align: 'right'
			},{
				type: 1,
				label: '程序信息',
				value: JSON.stringify(this.state.data.info.infos),
				align: 'right'
			},{
				type: 1,
				label: '容器',
				value: this.state.data.info.container,
				align: 'right'
			}
		] : []

		let health = this.state.data.health ? [
			{
				type: 2,
				label: '总体健康状况',
				value: this.state.data.health.status
			}
		].concat(this.state.data.health.childChecks.map(data => {
			return {
				type: 2,
				label: data.checkName,
				value: data.status
			}
		})) : []

		let memory = this.state.data.memory ? [
			{
				type: 3,
				label: `Total Memory(${this.state.data.memory.freeMemory}M/${this.state.data.memory.totalMemory}M)：`,
				value: this.state.data.memory.freeMemory,
				max: this.state.data.memory.totalMemory
			},{
				type: 3,
				label: `Heap Memory(${this.state.data.memory.usedHeap}M/${this.state.data.memory.maxHeap}M)：`,
				value: this.state.data.memory.usedHeap,
				max: this.state.data.memory.maxHeap
			},{
				type: 1,
				label: 'Initial Heap(-Xms)',
				value: `${this.state.data.memory.initHeap}M`
			},{
				type: 1,
				label: 'Maximum Heap(-Xmx)',
				value: `${this.state.data.memory.maxHeap}M`
			}
		] : []

		let jvm = this.state.data.jvm ? Object.keys(this.state.data.jvm).map(key => {
			return {
				type: 1,
				label: key,
				value: this.state.data.jvm[key],
				align: 'right'
			}
		}) : []

		let metrics = this.state.data.metrics ? this.state.data.metrics.map(data => {
			return {
				type: 1,
				label: data.name,
				value: data.value,
				align: 'right'
			}
		}) : []

		return (
			<div className={s.root}>
				<TabsHeader name={this.props.params.instanceId} 
							status={this.state.data.health ? this.state.data.health.status : 'OFFLINE'} 
							reloadHandler={this.reload}
							fallbackHandler={(e) => {
								this.context.router.push(`service/${this.props.params.serviceId}/status`)
							}}
							tabs={TABS} />
				<table className={s.content}>
					<tbody>
						<tr>
							<td>
								<KvList title='实例信息' data={info} />
							</td>
							<td>
								<KvList title='健康状况' data={health} />
							</td>
						</tr>
						<tr>
							<td>
								<KvList title='内存使用情况' data={memory} />
							</td>
							<td>
								<KvList title='jvm' data={jvm} />
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<KvList title='指标' data={metrics} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}
