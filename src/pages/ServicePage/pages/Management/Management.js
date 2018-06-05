import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import ContentHeader from '../../../../components/ContentHeader'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import Dialog from '../../../../components/Dialog'
import FormField from '../../../../components/FormField'
import s from './Management.scss'

const TABLE_HEADER = [
	{ name: '实例ID' },
	{ name: '服务状态',
	  align: 'center' },
	{ name: '所在区域' },
	{ name: '服务地址' },
	{ name: '启动时间' },
	{ name: '程序包' },
	{ name: '版本信息' },
	{ name: '类型' },
	{ name: '操作',
	  align: 'center' }
]

const MEM_TYPE = [
	{ value: 128, displayName: '128MB'},
	{ value: 512, displayName: '512MB'},
	{ value: 1024, displayName: '1GB'}
]

@fetch
export default class Status extends Component {

	static contextTypes = {
		serviceName: React.PropTypes.func
	}

	ENVLIST_EL = () => { return {
		key: '', 
		value: '', 
		plusCallback: (e) => {
			this.state.enviroments.splice(e.target.dataset.index + 1, 0, this.ENVLIST_EL())
			this.setState({
				enviroments: this.state.enviroments
			})
		}, 
		minusCallback: (e) => {
			this.state.enviroments.splice(e.target.dataset.index, 1)
			this.setState({
				enviroments: this.state.enviroments
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.enviroments[e.target.dataset.index].key = e.target.value
			this.setState({
				enviroments: this.state.enviroments
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.enviroments[e.target.dataset.index].value = e.target.value
			this.setState({
				enviroments: this.state.enviroments
			})
		}
	}}

	state = {
		data: {
			serviceName: '',
			serviceStatus: '',
			deployType: 1,
			serviceInstances: []
		},
		modalIsOpen: false,
		modalType: 0,	// 0: nan, 1: start service, 2: make service, 3: extend instance
		modalTitle: '',
		deploymentId: '',
		progressIsOpen: false,
		progress: {
			step: 1,
			steps: 10,
			message: '启动……'
		},
		instances: 1,
		name: '',
		port: 80,
		cpus: 0.1,
		mem: 128,
		cmd: '',
		enviroments: [this.ENVLIST_EL()]
	}

	@autobind
	fetch(data) {

		let modalType = 0, modalTitle = ''
		
		if (data.deployType == 1) {
			if (data.serviceInstances && data.serviceInstances.length > 0) {
				modalType = 3
				modalTitle = `扩展${this.context.serviceName(this.props.params.serviceId)}服务实例`				
			} else {
				modalType = 1
				modalTitle = `创建${this.context.serviceName(this.props.params.serviceId)}服务实例`
			}
		} else if (data.deployType == 2) {
				modalType = 2
				modalTitle = `启动${this.context.serviceName(this.props.params.serviceId)}服务`
		}

		this.setState({
			modalType: modalType,
			modalTitle: modalTitle,
			instances: data.serviceInstances.length, 
			data: data 
		})
	}

	@autobind
	op(op, instanceId) {
		this.props.fetch(`/api/v1/instance/${op}/${this.props.params.serviceId}/${instanceId}`, (data) => {
			this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)()
		}, {})()
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
		switch (this.state.modalType) {
		case 1:		
		case 2:
			return this.props.fetch(`/api/v1/control/start/${this.props.params.serviceId}`, (data) => {
				// this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)()
				this.processDeployment(data.id)
			}, {
				name: this.state.name,
				instances: this.state.instances,
				port: this.state.port,
				cpus: this.state.cpus,
				mem: this.state.mem,
				cmd: this.state.cmd,
				enviroments: this.state.enviroments
			})()	
		case 3:
			return this.props.fetch(`/api/v1/control/scale/${this.props.params.serviceId}`, (data) => {
				// this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)()
				this.processDeployment(data.id)
			}, {
				instances: this.state.instances
			})()
		default:
			return
		}	
  	}

  	@autobind
  	processDeployment(deploymentId) {
		
		this.setState({progressIsOpen: true})

		let pid = setInterval(
			this.props.fetch(`/api/v1/control/deployment/${this.props.params.serviceId}/${deploymentId}`,
				(data) => {
					if (data.currentStep > -1) {
						this.setState({
							progress: {
								step: data.currentStep,
								steps: data.totalSteps,
								message: data.status
							}
						})
					} else {
						this.finishDeployment(pid)
					}
				}
			), 
		1000)

		setTimeout(this.finishDeployment, 1000 * 60 * 5, pid)
  	}

  	@autobind
  	finishDeployment(pid) {
  		clearInterval(pid)
  		this.setState({progressIsOpen: false})
  		this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)()
  	}

  	@autobind
  	sop(op) {
		this.props.fetch(`/api/v1/control/${op}/${this.props.params.serviceId}`, (data) => {
			this.processDeployment(data.id)
		}, {})()		
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
					type: 5,
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
					name: ['重启动','刷新', '关闭'],
					handle: [(e) => this.op('restart', instance.serviceId),
							 (e) => this.op('refresh', instance.serviceId), 
							 (e) => this.op('shutdown', instance.serviceId)]
				}
			]
		})

		return (
			<div className={s.root}>
				<ContentHeader name={this.state.data.serviceName} 
							   status={this.state.data.serviceStatus} 
							   handle={this.props.fetch(`/api/v1/service/runtime/${this.props.params.serviceId}`, this.fetch)}>
				</ContentHeader>
				<div className={s.content}>
					<Table data={data}></Table>
					{(() => {
						switch (this.state.modalType) {
						case 1:
							return	<div className={s.newbtn}>
										<Button handle={this.openModal}><i className="fa fa-plus" aria-hidden="true"></i>创建实例</Button>
									</div>
						case 2:
							return	<div className={s.newbtn}>
										<Button handle={this.openModal}><i className="fa fa-play" aria-hidden="true"></i>创建服务</Button>
									</div>
						case 3:
							return	<div className={s.newbtn}>
										<Button handle={this.openModal}><i className="fa fa-plus" aria-hidden="true"></i>扩展实例</Button>
										<Button handle={(e) => this.sop('restart')}><i className="fa fa-repeat" aria-hidden="true"></i>重启服务</Button>
										<Button handle={(e) => this.sop('stop')}><i className="fa fa-close" aria-hidden="true"></i>关闭服务</Button>
									</div>
						default:
						}
					})()}
				</div>
				<Dialog title={this.state.modalTitle} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} ok={this.ok} okButtonName="启动" hasHeader={true} hasFooter={true}>
            		<div className={s.form}>
            			{this.state.modalType == 1 || this.state.modalType == 3 ?
            				<FormField 	label="实例数量" 
            							type={1} 
            							min={1} 
            							max={10} 
            							value={this.state.instances} 
            							valueChangeCallback={(e) => {this.setState({instances: e.target.value})}} />
            				: <FormField label="服务名称" 
            							 type={2}
            							 value={this.state.name} 
            							 valueChangeCallback={(e) => {this.setState({name: e.target.value})}} />
            			}
            			{this.state.modalType == 1 || this.state.modalType == 2 ?
            				<div>
	            				<FormField 	label="服务端口" 
	            							type={1} 
	            							min={10000} 
	            							max={99999} 
	            							comment="（请选择1万以上的端口）" 
	            							value={this.state.port} 
	            							valueChangeCallback={(e) => {this.setState({port: e.target.value})}} />

	            				<FormField 	label="CPUs" 
	            							type={1} 
	            							min={0.01} 
	            							max={100} 
	            							step={0.01} 
	            							value={this.state.cpus} 
	            							valueChangeCallback={(e) => {this.setState({cpus: e.target.value})}} />

	            				<FormField 	label="实例内存" 
	            							type={3} 
	            							map={MEM_TYPE} 
	            							radioExt={true} 
	            							radioExtType="number" 
	            							radioExtUnit="MB" 
	            							value={this.state.mem} 
	            							valueChangeCallback={(e) => {this.setState({mem: e.target.value})}} />
	            			
	            				<FormField 	label="启动命令" 
	            							type={2} 
	            							value={this.state.cmd} 
	            							valueChangeCallback={(e) => {this.setState({cmd: e.target.value})}} />
	            				
	            				<FormField label="环境变量"
	            						   type={4} 
	            						   list={this.state.enviroments} />
	            			</div>
	            			: <div />      				
            			}
            		</div>
          		</Dialog>
          		<Dialog modalIsOpen={this.state.progressIsOpen} hasHeader={false} hasFooter={false}>
          			<div className={s.progress}>
          			<p>{this.state.progress.message}</p>
          			<progress value={this.state.progress.step} max={this.state.progress.steps}></progress>
          			</div>
          		</Dialog>
			</div>
		)
	}
}
