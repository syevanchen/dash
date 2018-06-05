import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import classnames from 'classnames'
import fetch from '../../../../../../decorators/Fetch'
import TabsHeader from '../../../../../../components/TabsHeader'
import FormField from '../../../../../../components/FormField'
import Button from '../../../../../../components/Button'
import Alert from '../../../../../../components/Alert'
import Table from '../../../../../../components/Table'
import s from './Log.scss'

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

const LOG_QUEUE_SIZE = 200

const TABLE_HEADER = [
    { name: 'ID'       },
    { name: '文件名'   },
    { name: '更新日期' },
    { name: '大小'     }
]

@fetch
export default class Log extends Component {

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
            info: {
                host: '___.___.___.___'
            }
        },
        login: 0, // 0: login 1: tail 2: download
        username: '',
        password: '',
        errMsg: '',
        outputFold: false,
        outputAutoScroll: true,
        logs: [],
        logfiles: []
    }

    source = null

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

    componentWillUnmount() {
        console.log('sse close')
        try {
            this.source.close()
            this.source.onopen = undefined
            this.source.onmessage = undefined
            this.source.onerror = undefined
        } catch(e) {/* dummy */}
        this.source = null
    }

    componentDidUpdate() {
        if (this.state.outputAutoScroll) {
            this.refs.output.scrollTop = this.refs.output.scrollHeight
        }
    }

    @autobind
    reload() {
        this.props.fetch(`/api/v1/instance/health/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('health'))()
        this.props.fetch(`/api/v1/instance/info/${this.props.params.serviceId}/${this.props.params.instanceId}`, this.fetch('info'))()      
    }

    @autobind
    login() {

        if (this.state.username.length < 1) {
            this.setState({errMsg: '用户名不能为空'})
            return
        }

         if (this.state.password.length < 1) {
            this.setState({errMsg: '密码不能为空'})
            return
        }       

        this.setState({
            errMsg: '',
            login: 1
        })

        this.props.fetch(`/api/v1/instance/login/${this.props.params.serviceId}/${this.props.params.instanceId}`, (data) => {
            if (data.ok) {
                
                console.log('sse start')

                this.source = new EventSource(`/api/v1/instance/log/${this.props.params.serviceId}/${this.props.params.instanceId}`)
                this.source.onopen = (event) => {
                    console.log('sse open')
                }
                this.source.onmessage = (event) => {
                    if (this.state.logs.length > LOG_QUEUE_SIZE) {
                        this.state.logs.shift();
                    }
                    console.log(event.data)
                    this.state.logs.push(event.data)
                    this.setState({logs: this.state.logs})
                }
                this.source.onerror = (event) => {
                    console.log('sse error')
                    this.setState({errMsg: event.data ? event.data : '连接服务器中断，请刷新页面重试'})
                    this.source.close()
                    this.source.onopen = undefined
                    this.source.onmessage = undefined
                    this.source.onerror = undefined
                    this.source = null
                }
                console.log('sse prepared')
            } else {

                console.log('sse failed')

                this.setState({
                    login: 0,
                    username: '',
                    password: '',
                    errMsg: data.error
                })
            }
        }, {
            username: this.state.username,
            password: this.state.password
        })()
    }

    @autobind
    download() {

        if (this.state.username.length < 1) {
            this.setState({errMsg: '用户名不能为空'})
            return
        }

         if (this.state.password.length < 1) {
            this.setState({errMsg: '密码不能为空'})
            return
        }       

        this.setState({
            errMsg: '',
            login: 2
        })

        this.props.fetch(`/api/v1/instance/login/${this.props.params.serviceId}/${this.props.params.instanceId}`, (data) => {
            if (data.ok) {
                this.props.fetch(`/api/v1/instance/list/${this.props.params.serviceId}/${this.props.params.instanceId}`, data => {
                    this.setState({ logfiles: data })
                })()
            } else {

                console.log('login failed')

                this.setState({
                    login: 0,
                    username: '',
                    password: '',
                    errMsg: data.error
                })
            }
        }, {
            username: this.state.username,
            password: this.state.password
        })()
    }

    render() {

        const data = {
            header: TABLE_HEADER,
            content: []
        }

        data.content = this.state.logfiles.map((file, idx) => {
            return [
                {
                    type: 1,
                    value: idx + 1
                },{
                    type: 7,
                    link: `/api/v1/instance/download/${this.props.params.serviceId}/${this.props.params.instanceId}/${file.filename}`,
                    value: file.filename
                },{
                    type: 1,
                    value: `${file.date} ${file.time}`
                },{
                    type: 1,
                    value: file.size
                }
            ]
        })

        return (
            <div className={s.root}>
                <TabsHeader name={this.props.params.instanceId} 
                            status={this.state.data.health ? this.state.data.health.status : 'OFFLINE'} 
                            reloadHandler={this.reload}
                            fallbackHandler={(e) => {
                                this.context.router.push(`service/${this.props.params.serviceId}/status`)
                            }}
                            tabs={TABS} />
                <Alert message={this.state.errMsg} />
                <div className={s.content}>
                    <div className={classnames({[s.hide]: this.state.login != 0})}>
                        <p className={s.title}>请输入服务器 {this.state.data.info.host.split(':')[0]} 的用户名和密码</p>
                        <div>
                            <FormField label='用户名' 
                                       type={2}
                                       value={this.state.username} 
                                       valueChangeCallback={(e) => {this.setState({username: e.target.value})}} />
                            <FormField label='密码' 
                                       type={6}
                                       value={this.state.password} 
                                       valueChangeCallback={(e) => {this.setState({password: e.target.value})}} />
                            <div className={s.submit}>
                                <Button handle={this.login}><i className="fa fa-sign-in" aria-hidden="true"></i>　登录</Button>
                                <Button handle={this.download}><i className="fa fa-download" aria-hidden="true"></i>　下载</Button>
                            </div>
                        </div>
                    </div>
                    <div className={classnames({[s.hide]: this.state.login != 1})}>
                        <div className={s.btnbar}>
                            <span className={s.switcher}><input type="checkbox" checked={this.state.outputFold} onChange={(e) => {this.setState({outputFold: e.target.checked})}} /><span>折行</span></span>
                            <span className={s.switcher}><input type="checkbox" checked={this.state.outputAutoScroll} onChange={(e) => {this.setState({outputAutoScroll: e.target.checked})}}/><span>自动卷屏</span></span>
                        </div>
                        <div className={s.output} ref='output'>
                        {this.state.logs.length > 0 ? this.state.logs.map((log, idx) => {
                            if (idx == this.state.logs.length - 1) 
                                return <span className={classnames(s.line, {[s.wrap]: !this.state.outputFold})} key={idx}>{log} <span className={s.blink}>_</span></span>
                            else
                                return <span className={classnames(s.line, {[s.wrap]: !this.state.outputFold})} key={idx}>{log}</span>
                        }) : <p>正在建立 SSH 隧道 <span className={s.blink}>_</span></p>}
                        </div>
                    </div>
                    <div className={classnames({[s.hide]: this.state.login != 2})}>
                        <div className={s.table}>
                            <Table data={data}></Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
