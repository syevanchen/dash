import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import ContentHeader from '../../../../components/ContentHeader'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import Dialog from '../../../../components/Dialog'
import FormField from '../../../../components/FormField'
import s from './Register.scss'

const TABLE_HEADER = [
	{ name: '服务ID' },
	{ name: '实例ID' },
	{ name: '服务地址' },
	{ name: '检查点' },
	{ name: '健康状况',
	  align: 'center' },
	{ name: '操作',
	  align: 'center' }
]

@fetch
export default class Register extends Component {

	@autobind
	fetch(data) {
		this.setState({ data: data })
		this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/list-services`, (nodes) => {
			this.setState({
				nodes: nodes,
				nodeMap: Object.keys(nodes).map(key => [{value: key, displayName: key}]).reduce((pre, cur) => pre.concat(cur), [{value: '', displayName: ''}])
			})
		})()
	}

	@autobind
	openModal() {
    	this.setState({modalIsOpen: true})
  	}

  	@autobind
  	closeModal() {
  		this.setState({modalIsOpen: false})
  	}

  	@autobind
  	ok() {
  		this.setState({modalIsOpen: false})
  		this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/register-service`, 
  		(data) => this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)(),
  		{
  			node: this.state.node,
  			service: {
  				id: this.state.serviceId,
  				name: this.state.name,
  				address: this.state.address,
  				port: this.state.port,
  				tags: this.state.tags.map(el => el.value),
  				check: {
  					http: this.state.checkUrl,
  					interval: `${this.state.checkInterval}s`
  				}
  			}
  		})()
  	}

	TAGS_EL = (value) => { return {
		value: value || '', 
		plusCallback: (e) => {
			this.state.tags.splice(e.target.dataset.index + 1, 0, this.TAGS_EL())
			this.setState({
				tags: this.state.tags
			})
		}, 
		minusCallback: (e) => {
			this.state.tags.splice(e.target.dataset.index, 1)
			this.setState({
				tags: this.state.tags
			})		
		}, 
		valueChangeCallback: (e) => {
			this.state.tags[e.target.dataset.index].value = e.target.value
			this.setState({
				tags: this.state.tags
			})
		}
	}}

	state = {
		data: {
			serviceName: '',
			serviceStatus: ''
		},
		nodes: {},
		modalIsOpen: false,
		nodeMap: [],
		node: '',
		name: '',
		serviceId: '',
		address: '',
		port: 80,
		checkUrl: '',
		checkInterval: 20,
		tags: [this.TAGS_EL()]
	}

	constructor(props) {
		super(props)
		props.fetch(`/api/v1/service/runtime/${props.params.serviceId}`, this.fetch)()
	}

	render() {

		return <div className={s.root}>
				<ContentHeader name={this.state.data.serviceName} 
							   status={this.state.data.serviceStatus} 
							   handle={this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)}></ContentHeader>
				<div className={s.content}>
					{Object.keys(this.state.nodes).map(key => {
						return (
							<section key={key} className={s.block}>
								<div className={s.header}>节点：{key}</div>
								<Table data={{
									header: TABLE_HEADER,
									content: this.state.nodes[key].map(service => {
										return [
											{
												type: 1,
												value: service.serviceName
											},{
												type: 1,
												value: service.serviceID
											},{
												type: 1,
												value: service.address
											},{
												type: 1,
												value: service.check
											},{
												type: 6,
												value: service.health
											},{
												type: 3,
												name: '删除',
												handle: (e) => {
													this.props.fetch(`/api/v1/service/command/${this.props.params.serviceId}/deregister-service`,
														(data) => this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)(),
														{node: service.node, serviceId: service.serviceID}
													)()
												}
											}
										]
									})
								}}></Table>								
							</section>
						)
					})}
					<div className={s.newbtn}>
						<Button handle={this.openModal}><i className="fa fa-plus" aria-hidden="true"></i> 注册新服务</Button>
					</div>
				</div>
				<Dialog title="注册新服务" modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} ok={this.ok} okButtonName="注册" hasHeader={true} hasFooter={true}>
					<div className={s.form}>
						<FormField 	label="注册节点" 
        							type={7}
        							map={this.state.nodeMap}
        							value={this.state.node} 
        							valueChangeCallback={(e) => {this.setState({node: e.target.value})}} />
						<FormField label="服务名称" 
            					   type={2}
            					   value={this.state.name} 
            					   valueChangeCallback={(e) => {this.setState({name: e.target.value})}} />
						<FormField label="服务实例ID" 
            					   type={2}
            					   value={this.state.serviceId} 
            					   valueChangeCallback={(e) => {this.setState({serviceId: e.target.value})}} />
						<FormField label="服务地址" 
            					   type={2}
            					   value={this.state.address} 
            					   valueChangeCallback={(e) => {this.setState({address: e.target.value})}} />
        				<FormField label="服务端口" 
        						   type={1} 
        						   value={this.state.port} 
        						   valueChangeCallback={(e) => {this.setState({port: e.target.value})}} />
						<FormField label="检测URL" 
            					   type={2}
            					   value={this.state.checkUrl} 
            					   valueChangeCallback={(e) => {this.setState({checkUrl: e.target.value})}} />
        				<FormField label="检测周期" 
        						   type={1} 
        						   min={0} 
        						   max={99999} 
        						   comment="（秒）" 
        						   value={this.state.checkInterval} 
        						   valueChangeCallback={(e) => {this.setState({checkInterval: e.target.value})}} />
        				<FormField label="标签"
        						   type={8} 
        						   list={this.state.tags} />
					</div>				
				</Dialog>
		</div>
	}
}