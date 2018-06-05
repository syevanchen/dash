import React, { Component, PropTypes } from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import SearchBar from '../../../../components/SearchBar'
import ComboBox from '../../../../components/ComboBox'
import Table from '../../../../components/Table'
import s from './Logs.scss'

const TABLE_HEADER = [
	{ name: '时间' },
	{ name: '实例' },
	{ name: '日志内容' }
]

const LOG_LEVEL = [
	{value: 'all', displayName: '选择日志级别'},
	{value: 'FATAL', displayName: 'FATAL'},
	{value: 'ERROR', displayName: 'ERROR'},
	{value: 'WARN', displayName: 'WARN'},
	{value: 'INFO', displayName: 'INFO'},
	{value: 'DEBUG', displayName: 'DEBUG'}			
]

const TIME_RANGE = [
	{value: 0, displayName: '选择时间范围'},
	{value: 1, displayName: '最近15分钟'},
	{value: 2, displayName: '最近30分钟'},
	{value: 3, displayName: '最近1小时'},
	{value: 4, displayName: '最近1天'}
]

const HEADER_HEIGHT = 110;
const ITEM_HEIGHT = 47;
const FETCH_SIZE = 60;
const BUFFER_SIZE = 30;


if (!Date.prototype.toCustomizeString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toCustomizeString = function() {
      return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        ' ' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
    };

  }());
}

@fetch
export default class Logs extends Component {

	@autobind
	fetch(data) {
		this.setState({
			refresh: false,
			lastFetchSize: data.length,
			data: this.state.refresh ? data : this.state.data.concat(data) 
		})
	}

	@autobind
	instances(data) {
		this.setState({
			instances: this.state.instances.concat(data.serviceInstances.map(instance => {
				return {
					value: instance.containerName,
					displayName: instance.serviceId
				}
			}))
		})
	}

	@autobind
	makeTimeRange(type) {

		let timeRangefrom = new Date();
		
		console.log(type)

		switch(type) {
		case '1':
			timeRangefrom.setMinutes(timeRangefrom.getMinutes() - 15)
			return {
				from: timeRangefrom.toCustomizeString(),
				to: null
			}		
		case '2':
			timeRangefrom.setMinutes(timeRangefrom.getMinutes() - 30)
			return {
				from: timeRangefrom.toCustomizeString(),
				to: null
			}
		case '3':
			timeRangefrom.setHours(timeRangefrom.getHours() - 1)
			return {
				from: timeRangefrom.toCustomizeString(),
				to: null
			}		
		case '4':
			timeRangefrom.setDate(timeRangefrom.getDate() - 1)
			return {
				from: timeRangefrom.toCustomizeString(),
				to: null
			}		
		case '0':
		default:
			return {
				from: null,
				to: null				
			}
		}
	}

	@autobind
	handleScroll(e) {
		if (this.state.lastFetchSize < FETCH_SIZE) {
			return;
		}

		let gap = this.state.data.length - Math.round((e.srcElement.scrollTop + e.srcElement.offsetHeight - HEADER_HEIGHT) / ITEM_HEIGHT)

		if (gap > 0 && gap < BUFFER_SIZE) {
			// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
			this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
				query: this.state.query,
				size: FETCH_SIZE,
				from: this.state.data.length,
			 timeRange: this.makeTimeRange(this.state.time),
			 containerName: this.state.instance,
			 logLevel: this.state.level
			})()
		}
	}

	@autobind
	filter(e) {
		
		console.log(e.target.name)
		console.log(e.target.value)

		this.setState({
			refresh: true,
			[e.target.name]: e.target.value == 'all' ? null : e.target.value
		})

		switch (e.target.name) {
		case 'query':
			// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
			this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
				query: e.target.value,
				size: FETCH_SIZE,
				from: this.state.data.length,
				timeRange: this.makeTimeRange(this.state.time),
				containerName: this.state.instance,
				logLevel: this.state.level
			})()			
			break;
		case 'time':
			// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
			this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
				query: this.state.query,
				size: FETCH_SIZE,
				from: this.state.data.length,
				timeRange: this.makeTimeRange(e.target.value),
				containerName: this.state.instance,
				logLevel: this.state.level
			})()
			break;
		case 'instance':
			// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
			this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
				query: this.state.query,
				size: FETCH_SIZE,
				from: this.state.data.length,
				timeRange: this.makeTimeRange(this.state.time),
				serviceId: e.target.value == 'all' ? null : e.target.value,
				logLevel: this.state.level
			})()
			break;
		case 'level':
			// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
			this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
				query: this.state.query,
				size: FETCH_SIZE,
				from: this.state.data.length,
				timeRange: this.makeTimeRange(this.state.time),
				containerName: this.state.instance,
				logLevel: e.target.value == 'all' ? null : e.target.value
			})()
			break;
		default:
			console.log(e.target.name, e.target.value)
		}
	}

	state = {
		instances: [{
			value: 'all',
			displayName: '选择实例'			
		}],
		query: '',
		time: 0,
		instance: null,
		level: null,
		refresh: false,
		lastFetchSize: 0,
		data: []
	}
	
	constructor(props) {
		super(props)
		props.fetch(`/api/v1/service/runtime/${props.params.serviceId}`, this.instances)()
	}

	componentWillMount() {
		//empty
	}

	componentDidMount() {
		document.getElementById("content").addEventListener('scroll', this.handleScroll)

		// this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch)()
		this.props.fetch(`/api/v1/service/logs/${this.props.params.serviceId}`, this.fetch, {
			query: this.state.query,
			size: FETCH_SIZE,
			from: 0,
			timeRange: this.makeTimeRange(this.state.time),
			containerName: this.state.instance,
			logLevel: this.state.level
		})()
	}

	componentWillUnmount() {
		document.getElementById("content").removeEventListener('scroll', this.handleScroll)
	}

	render() {

		const data = {
			header: TABLE_HEADER,
			content: []
		}

		data.content = this.state.data.map(log => {
			return [
				{
					type: 1,
					value: log.time
				},{
					type: 1,
					value: log.serviceId
				},{
					type: 1,
					value: log.message
				}
			]
		})

		return (
			<div className={s.root}>
				<SearchBar searchHandler={this.filter} />
				<div className={s.filter}>
					<ComboBox name="time" label="时间" options={TIME_RANGE} selectHandler={this.filter} />
					<ComboBox name="instance" label="实例" options={this.state.instances} selectHandler={this.filter} />
					{/*	<ComboBox name="level" label="级别" options={LOG_LEVEL} selectHandler={this.filter} /> */}
				</div>
				<div className={s.content}>
					<Table data={data} />
				</div>
			</div>
		)
	}
}
