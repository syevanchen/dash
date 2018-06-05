import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../../../decorators/Fetch'
import TabsHeader from '../../../../../../components/TabsHeader'
import KvList from '../../../../../../components/KvList'
import s from './Env.scss'

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
export default class Env extends Component {

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
		data: {
			health: {
				status: 'OFFLINE'
			},
			env: []
		}
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
		this.props.fetch(`/api/v1/instance/health/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('health'))()		
		this.props.fetch(`/api/v1/instance/env/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('env'))()		
	}

	render() {

		return (
			<div className={s.root}>
				<TabsHeader name={this.props.params.instanceId} 
							status={this.state.data.health.status} 
							reloadHandler={this.reload}
							fallbackHandler={(e) => {
								this.context.router.push(`service/${this.props.params.serviceId}/status`)
							}}
							tabs={TABS} />
				<table className={s.content}>
					<tbody>
						{
							this.state.data.env.map((data, i) => {
								return <tr key={i}><td><KvList title={data.groupName} data={Object.keys(data.properties).map(key => {
									return {
										type: 1,
										label: key,
										value: data.properties[key],
										align: 'left'
									}
								})} /></td></tr>
							})
						}
					</tbody>
				</table>
			</div>
		)
	}
}


// let rows = (data) => {
// 	return Object.keys(data).map(key => {
// 		return {
// 			type: 1,
// 			label: key,
// 			value: data[key],
// 			align: 'left'
// 		}
// 	})
// }