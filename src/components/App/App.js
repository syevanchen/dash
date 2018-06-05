import React from 'react'
import classnames from 'classnames'
import autobind from 'autobind-decorator'
import fetch from '../../decorators/Fetch'
import PageHeader from '../PageHeader'
import Sidebar from '../Sidebar'
import ListItem from '../ListItem'
import Dropdown from '../Dropdown'
import Dialog from '../Dialog'
import SideTab from '../SideTab'
import FormField from '../FormField'
import s from './App.scss'

const MENU_URL = '/data/menu.json'

const MENU = {
	summary: true,
	apidoc: true,
	status: true,
	control: true,
	logs: true,
	resource: true,
	entry: true,
	register: true
}

const DIALOG_MENU = ['常规设置', '管理接口', '服务注册发现', '服务日志', '服务容器', '服务部署', '环境变量'];

const DISCOVERY_TYPE = [
	{ value: 'consul', displayName: 'Consul'}
]

const LOG_TYPE = [
	{ value: 'none', displayName: '无'},
	{ value: 'file', displayName: '日志文件'},
	{ value: 'elasticsearch', displayName: 'Elasticsearch'},
	{ value: 'mongo', displayName: 'MongoDB'},
	{ value: 'amqp', displayName: 'AMQP'}
]

const CONTAINER_TYPE = [
	{ value: 'none', displayName: '无'},
	{ value: 'docker', displayName: 'Docker'}
]

const DEPLOY_TYPE = [
	{ value: 0, displayName: '预先部署'},
	{ value: 1, displayName: '单服务集群'},
	{ value: 2, displayName: '多服务集群'}
]

const SCHEDULER_TYPE = [
	{ value: 'none', displayName: '无'},
	{ value: 'marathon', displayName: 'Marathon'}
]

const assemble = (data) => {

	// data.serviceDeployContraints.map(el => el.value)
	// data.serviceDiscoveryParams.reduce((o, e) => {o[e.key] = e.value; return o})

	return {
		serviceName: data.serviceName,
		displayName: data.serviceDisplayName,
		serviceType: data.serviceType,
		apiDocURI: data.serviceApiDocUrl,
		entryURL: data.serviceEntryUrl,
		icon: data.serviceIcon,
		enabled: data.serviceEnabled,
		adminContextPath: data.serviceAdminPath,
		adminUsername: data.serviceAdminAccount,
		adminPassword: data.serviceAdminPassword,
		discoveryType: data.serviceDiscoveryType,
		discoveryParams: data.serviceDiscoveryParams,
		logbaseType: data.serviceLogType,
		logbaseParams: data.serviceLogParams,
		containerType: data.serviceContainerType,
		containerParams: data.serviceContainerParams,
		deployType: data.serviceDeployType,
		deployContraints: data.serviceDeployContraints.map(el => el.value),
		serviceProfile: data.serviceProfile,
		schedulerType: data.serviceScheduler,
		schedulerParams: data.serviceSchedulerParams,
		serviceEnviroments: data.serviceEnviroments
	}
}

@fetch
export default class App extends React.Component {

	static childContextTypes = {
		serviceName: React.PropTypes.func,
		menu: React.PropTypes.func,
		accessToken: React.PropTypes.string,
		tokenType: React.PropTypes.string,
		login: React.PropTypes.func
	}

	getChildContext() {
		return {
			serviceName: (serviceId) => {

				let services = this.state.menu.filter((data) => {
					return data.id == serviceId
				})

				return services && services.length > 0 ? services[0].name : ''
			},

			menu: (serviceId) => {

				let services = this.state.menu.filter((data) => {
					return data.id == serviceId
				})

				return services && services.length > 0 ? services[0].menu : MENU
			},
			accessToken: this.state.accessToken,
			tokenType: this.state.tokenType,
			login: () => {
				this.setState({
					loginModalIsOpen: true
				})
			}
		}
	}

	DISCOVERYPARAMS_EL = (key, value) => { return {
		key: key || '', 
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceDiscoveryParams.splice(e.target.dataset.index + 1, 0, this.DISCOVERYPARAMS_EL())
			this.setState({
				serviceDiscoveryParams: this.state.serviceDiscoveryParams
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceDiscoveryParams.splice(e.target.dataset.index, 1)
			this.setState({
				serviceDiscoveryParams: this.state.serviceDiscoveryParams
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.serviceDiscoveryParams[e.target.dataset.index].key = e.target.value
			this.setState({
				serviceDiscoveryParams: this.state.serviceDiscoveryParams
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceDiscoveryParams[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceDiscoveryParams: this.state.serviceDiscoveryParams
			})
		}
	}}

	LOGPARAMS_EL = (key, value) => { return {
		key: key || '', 
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceLogParams.splice(e.target.dataset.index + 1, 0, this.LOGPARAMS_EL())
			this.setState({
				serviceLogParams: this.state.serviceLogParams
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceLogParams.splice(e.target.dataset.index, 1)
			this.setState({
				serviceLogParams: this.state.serviceLogParams
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.serviceLogParams[e.target.dataset.index].key = e.target.value
			this.setState({
				serviceLogParams: this.state.serviceLogParams
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceLogParams[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceLogParams: this.state.serviceLogParams
			})
		}
	}}

	CONTAINERPARAMS_EL = (key, value) => { return {
		key: key || '', 
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceContainerParams.splice(e.target.dataset.index + 1, 0, this.CONTAINERPARAMS_EL())
			this.setState({
				serviceContainerParams: this.state.serviceContainerParams
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceContainerParams.splice(e.target.dataset.index, 1)
			this.setState({
				serviceContainerParams: this.state.serviceContainerParams
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.serviceContainerParams[e.target.dataset.index].key = e.target.value
			this.setState({
				serviceContainerParams: this.state.serviceContainerParams
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceContainerParams[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceContainerParams: this.state.serviceContainerParams
			})
		}
	}}

	DEPLOYCONTRAINTS_EL = (value) => { return {
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceDeployContraints.splice(e.target.dataset.index + 1, 0, this.DEPLOYCONTRAINTS_EL())
			this.setState({
				serviceDeployContraints: this.state.serviceDeployContraints
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceDeployContraints.splice(e.target.dataset.index, 1)
			this.setState({
				serviceDeployContraints: this.state.serviceDeployContraints
			})		
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceDeployContraints[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceDeployContraints: this.state.serviceDeployContraints
			})
		}
	}}

	SCHEDULERPARAMS_EL = (key, value) => { return {
		key: key || '', 
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceSchedulerParams.splice(e.target.dataset.index + 1, 0, this.SCHEDULERPARAMS_EL())
			this.setState({
				serviceSchedulerParams: this.state.serviceSchedulerParams
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceSchedulerParams.splice(e.target.dataset.index, 1)
			this.setState({
				serviceSchedulerParams: this.state.serviceSchedulerParams
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.serviceSchedulerParams[e.target.dataset.index].key = e.target.value
			this.setState({
				serviceSchedulerParams: this.state.serviceSchedulerParams
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceSchedulerParams[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceSchedulerParams: this.state.serviceSchedulerParams
			})
		}
	}}

	SERVICEENVS_EL = (key, value) => { return {
		key: key || '', 
		value: value || '', 
		plusCallback: (e) => {
			this.state.serviceEnviroments.splice(e.target.dataset.index + 1, 0, this.SERVICEENVS_EL())
			this.setState({
				serviceEnviroments: this.state.serviceEnviroments
			})
		}, 
		minusCallback: (e) => {
			this.state.serviceEnviroments.splice(e.target.dataset.index, 1)
			this.setState({
				serviceEnviroments: this.state.serviceEnviroments
			})		
		}, 
		keyChangeCallback: (e) => {
			this.state.serviceEnviroments[e.target.dataset.index].key = e.target.value
			this.setState({
				serviceEnviroments: this.state.serviceEnviroments
			})
		}, 
		valueChangeCallback: (e) => {
			this.state.serviceEnviroments[e.target.dataset.index].value = e.target.value
			this.setState({
				serviceEnviroments: this.state.serviceEnviroments
			})
		}
	}}

	@autobind
	fetch(data) {

		const menu = [].concat.apply([], data.data.map(data => {
			return data.items.map(data => {
				return {
					id: data.href,
					name: data.name,
					menu: data.subMenu
				}
			})
		}))

		this.setState({
			data: data.data,
			menu: menu
		}) 
	}

	@autobind
	isActive(num) {
		this.setState({
			activeNum: num
		})
	}

	@autobind
	createService(e) {
		
		// console.log(e.target.dataset.groupId)
		// console.log(e.target.dataset.groupName)
		
		this.setState({
			modalIsOpen: true,
			modalTitle: `创建${e.target.dataset.groupName}`,
			okButtonName: '创建',
			serviceGroupId: e.target.dataset.groupId,
			activeNum: 0,
			serviceId: '',
			serviceName: '',
			serviceDisplayName: '',
			serviceType: '',
			serviceIcon: '',
			serviceApiDocUrl: '',
			serviceEntryUrl: '',
			serviceEnabled: false,
			serviceAdminPath: '',
			serviceAdminAccount: '',
			serviceAdminPassword: '',
			serviceDiscoveryType: 'consul',
			serviceDiscoveryParams: [this.DISCOVERYPARAMS_EL()],
			serviceLogType: 'file',
			serviceLogParams: [this.LOGPARAMS_EL()],
			serviceContainerType: 'docker',
			serviceContainerParams: [this.CONTAINERPARAMS_EL()],
			serviceDeployType: 0,
			serviceDeployContraints: [this.DEPLOYCONTRAINTS_EL()],
			serviceProfile: '',
			serviceScheduler: 'marathon',
			serviceSchedulerParams: [this.SCHEDULERPARAMS_EL()],
			serviceEnviroments: [this.SERVICEENVS_EL()]
		})
	}

	@autobind
	updateService(e, serviceId) {

		// console.log(serviceId.split('/')[1])

		this.props.fetch(`/api/v1/service/${serviceId.split('/')[1]}`, (data) => {
			this.setState({
				serviceId: serviceId.split('/')[1],
				modalIsOpen: true, 
				okButtonName: '保存',
				serviceName: data.serviceName || '',
				serviceDisplayName: data.displayName  || '',
				serviceType: data.serviceType  || '',
				serviceIcon: data.icon  || '',
				serviceApiDocUrl: data.apiDocURI  || '',
				serviceEntryUrl: data.entryURL  || '',
				serviceEnabled: data.enabled  || false,
				serviceAdminPath: data.adminContextPath  || '',
				serviceAdminAccount: data.adminUsername  || '',
				serviceAdminPassword: data.adminPassword  || '',
				serviceDiscoveryType: data.discoveryType  || 'consul',
				// serviceDiscoveryParams: data.discoveryParams ? Object.keys(data.discoveryParams).map(key => this.DISCOVERYPARAMS_EL(key, data.discoveryParams[key])) : [this.DISCOVERYPARAMS_EL()],
				serviceDiscoveryParams: data.discoveryParams ? data.discoveryParams.map(param => this.DISCOVERYPARAMS_EL(param.key, param.value)) : [this.DISCOVERYPARAMS_EL()],
				serviceLogType: data.logbaseType || 'none',
				// serviceLogParams: data.logbaseParams ? Object.keys(data.logbaseParams).map(key => this.LOGPARAMS_EL(key, data.logbaseParams[key])) : [this.LOGPARAMS_EL()],
				serviceLogParams: data.logbaseParams ? data.logbaseParams.map(param => this.LOGPARAMS_EL(param.key, param.value)) : [this.LOGPARAMS_EL()],
				serviceContainerType: data.containerType || 'none',
				// serviceContainerParams: data.containerParams ? Object.keys(data.containerParams).map(key => this.CONTAINERPARAMS_EL(key, data.containerParams[key])) : [this.CONTAINERPARAMS_EL()],
				serviceContainerParams: data.containerParams ? data.containerParams.map(param => this.CONTAINERPARAMS_EL(param.key, param.value)) : [this.CONTAINERPARAMS_EL()],
				serviceDeployType: data.deployType || 1,
				serviceDeployContraints: data.deployContraints ? data.deployContraints.map(value => this.DEPLOYCONTRAINTS_EL(value)) : [this.DEPLOYCONTRAINTS_EL()],
				serviceProfile: data.serviceProfile || '',
				serviceScheduler: data.schedulerType || 'none',
				// serviceSchedulerParams: data.schedulerParams ? Object.keys(data.schedulerParams).map(key => this.SCHEDULERPARAMS_EL(key, data.schedulerParams[key])) : [this.SCHEDULERPARAMS_EL()]
				serviceSchedulerParams: data.schedulerParams ? data.schedulerParams.map(param => this.SCHEDULERPARAMS_EL(param.key, param.value)) : [this.SCHEDULERPARAMS_EL()],
				serviceEnviroments: data.serviceEnviroments ? data.serviceEnviroments.map(param => this.SERVICEENVS_EL(param.key, param.value)) : [this.SERVICEENVS_EL()]
			})
		})()
	}

	@autobind
	closeModal() {
		this.setState({ modalIsOpen: false })
	}

	@autobind
	ok() {
		this.setState({ modalIsOpen: false })

		let url = '/api/v1/service'
		let method = 'POST'

		if (this.state.okButtonName === '创建') {
			url += `/${this.state.serviceGroupId}`
		} else if (this.state.okButtonName === '保存') {
			url += `/${this.state.serviceId}`
			method = 'PUT'
		}

		this.props.fetch(url, (data) => {
			this.props.fetch(MENU_URL, this.fetch)()
		}, assemble(this.state), method)()
	}

	state = {
		data: [],
		menu: [],
		accessToken: '',
		tokenType: '',
		loginModalIsOpen: false,
		modalTitle: '',
		modalIsOpen: false,
		okButtonName: '保存',
		activeNum: 0,
		serviceGroupName: '',
		serviceId: '',
		serviceName: '',
		serviceDisplayName: '',
		serviceType: '',
		serviceIcon: '',
		serviceApiDocUrl: '',
		serviceEntryUrl: '',
		serviceEnabled: false,
		serviceAdminPath: '',
		serviceAdminAccount: '',
		serviceAdminPassword: '',
		serviceDiscoveryType: 'consul',
		serviceDiscoveryParams: [this.DISCOVERYPARAMS_EL()],
		serviceLogType: 'file',
		serviceLogParams: [this.LOGPARAMS_EL()],
		serviceContainerType: 'docker',
		serviceContainerParams: [this.CONTAINERPARAMS_EL()],
		serviceDeployType: 0,
		serviceDeployContraints: [this.DEPLOYCONTRAINTS_EL()],
		serviceProfile: '',
		serviceScheduler: 'marathon',
		serviceSchedulerParams: [this.SCHEDULERPARAMS_EL()],
		serviceEnviroments: [this.SERVICEENVS_EL()]
	}

	constructor(props) {
		super(props)
		props.fetch(MENU_URL, this.fetch)()
	}

	componentWillMount() {
		this.setState({
			accessToken: this.props.location.query.access_token || '',
			tokenType: this.props.location.query.token_type || ''
		})
	}

	render() {
		return (
			<div className={s.root}>
				<PageHeader />
				<div className={s.container}>
					<Sidebar className={s.sidebar}
							 shrinkerClassName={s.shrinker}
							 expandClassName={s.expand}
							 shrinkClassName={s.shrink}>
						<ListItem icon='home'
								  name='仪表板'
								  href='/'
								  className={s.item}
								  hoverClassName={s.hover}
								  activeClassName={s.active}
								  actived={true} />
						{ this.state.data.map(data => {
							return (
								<Dropdown	key={data.id}
											groupId={data.id} 
										  	title={data.title} 
										  	titleClassName={s.title} 
										  	hoverClassName={s.hover}
										  	plus={this.createService}>
									{data.items.map(data => {
										return (
											<ListItem	key={data.id} 
													  	icon={data.icon}
													  	name={data.name}
													  	href={`service/${data.href}`}
													  	className={s.item}
													  	hoverClassName={s.hover}
													  	activeClassName={s.active}
													  	disableClassName={s.disable}
													  	disable={data.disable ? true : false}
													  	configurable={true}
													  	config={this.updateService} />
										)
									})}
								</Dropdown>
							)
						})}
					</Sidebar>
					<div className={s.content}>
						{this.props.children}
					</div>
				</div>
				<Dialog title={this.state.modalTitle} 
						modalIsOpen={this.state.modalIsOpen} 
						closeModal={this.closeModal} 
						ok={this.ok} 
						okButtonName={this.state.okButtonName} 
						hasHeader={true} 
						hasFooter={true}>
					<SideTab menu={DIALOG_MENU} isActive={this.isActive}>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 0})}>
							<FormField 	label="服务名称" 
            							type={2}
            							value={this.state.serviceName} 
            							valueChangeCallback={(e) => {this.setState({serviceName: e.target.value})}} />
            				<FormField 	label="服务显示名称" 
            							type={2}
            							value={this.state.serviceDisplayName} 
            							valueChangeCallback={(e) => {this.setState({serviceDisplayName: e.target.value})}} />
							<FormField 	label="管理接口类型" 
            							type={2}
            							value={this.state.serviceType} 
            							valueChangeCallback={(e) => {this.setState({serviceType: e.target.value})}} />
							<FormField 	label="图标" 
            							type={2}
            							value={this.state.serviceIcon} 
            							valueChangeCallback={(e) => {this.setState({serviceIcon: e.target.value})}} />
							<FormField 	label="API文档URL" 
            							type={2}
            							value={this.state.serviceApiDocUrl} 
            							valueChangeCallback={(e) => {this.setState({serviceApiDocUrl: e.target.value})}} />
							<FormField 	label="服务首页URL" 
            							type={2}
            							value={this.state.serviceEntryUrl} 
            							valueChangeCallback={(e) => {this.setState({serviceEntryUrl: e.target.value})}} />
							<FormField 	label="启用服务" 
            							type={5}
            							value={this.state.serviceEnabled} 
            							valueChangeCallback={(e) => {this.setState({serviceEnabled: e.target.checked})}} />            							
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 1})}>
							<FormField 	label="管理路径" 
            							type={2}
            							value={this.state.serviceAdminPath} 
            							valueChangeCallback={(e) => {this.setState({serviceAdminPath: e.target.value})}} />
							<FormField 	label="管理员账号" 
            							type={2}
            							value={this.state.serviceAdminAccount} 
            							valueChangeCallback={(e) => {this.setState({serviceAdminAccount: e.target.value})}} />
							<FormField 	label="管理员密码" 
            							type={6}
            							value={this.state.serviceAdminPassword} 
            							valueChangeCallback={(e) => {this.setState({serviceAdminPassword: e.target.value})}} />
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 2})}>
							<FormField 	label="注册发现方式" 
            							type={7}
            							map={DISCOVERY_TYPE}
            							value={this.state.serviceDiscoveryType} 
            							valueChangeCallback={(e) => {this.setState({serviceDiscoveryType: e.target.value})}} />
            				<FormField 	label="注册发现参数"
            						   	type={4} 
            						   	list={this.state.serviceDiscoveryParams} />
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 3})}>
							<FormField 	label="日志类型" 
            							type={7}
            							map={LOG_TYPE}
            							value={this.state.serviceLogType} 
            							valueChangeCallback={(e) => {this.setState({serviceLogType: e.target.value})}} />
            				<FormField 	label="日志库参数"
            						   	type={4} 
            						   	list={this.state.serviceLogParams} />
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 4})}>
							<FormField 	label="容器类型" 
            							type={7}
            							map={CONTAINER_TYPE}
            							value={this.state.serviceContainerType} 
            							valueChangeCallback={(e) => {this.setState({serviceContainerType: e.target.value})}} />
            				<FormField 	label="容器参数"
            						   	type={4} 
            						   	list={this.state.serviceContainerParams} />
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 5})}>
							<FormField 	label="部署方式" 
            							type={7}
            							map={DEPLOY_TYPE}
            							value={this.state.serviceDeployType}
            							valueChangeCallback={(e) => {this.setState({serviceDeployType: e.target.value})}} />
            				<FormField 	label="部署约束"
            						   	type={8} 
            						   	list={this.state.serviceDeployContraints} />
							<FormField 	label="配置文件类型" 
            							type={2}
            							value={this.state.serviceProfile} 
            							valueChangeCallback={(e) => {this.setState({serviceProfile: e.target.value})}} />
							<FormField 	label="调度器类型" 
            							type={7}
            							map={SCHEDULER_TYPE}
            							value={this.state.serviceScheduler}
            							valueChangeCallback={(e) => {this.setState({serviceScheduler: e.target.value})}} />
            				<FormField 	label="调度器参数"
            						   	type={4} 
            						   	list={this.state.serviceSchedulerParams} />
						</div>
						<div className={classnames(s.form, {[s.hide]: this.state.activeNum != 6})}>
            				<FormField 	label="环境变量"
            						   	type={4} 
            						   	list={this.state.serviceEnviroments} />
						</div>
					</SideTab>
				</Dialog>
				<Dialog title="登录提示" 
						modalIsOpen={this.state.loginModalIsOpen} 
						closeModal={(e) => this.setState({ loginModalIsOpen: false })} 
						ok={(e) => {
							this.setState({ loginModalIsOpen: false })
							window.location.href = '/login'
						}} 
						okButtonName="确认" 
						hasHeader={true} 
						hasFooter={true}>
					<p className={s.tip}>权限不足。是否跳转到登录页面？</p>
				</Dialog>
			</div>
		)
	}
}