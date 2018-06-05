import React from 'react'
import autobind from 'autobind-decorator'
import fetch from '../../decorators/Fetch'
import ListBox from '../../components/ListBox'
import Platform from '../../components/DbPlatform'
import s from './Dashboard.scss'

@fetch
export default class Dashboard extends React.Component {

	state = {
		events: [],
		services: []
	}

	componentDidMount() {
		this.props.fetch('/api/v1/main/catalog', this.fetchServices)()
		this.props.fetch('/api/v1/main/events', this.fetchEvents)()
	}

	@autobind
	fetchServices(data) {
		this.setState({
			services: Object.keys(data).map(key => data[key])
		})
	}

	@autobind
	fetchEvents(data) {

		let events = []

		data.forEach(event => {
			let createDate = new Date(event.createDate)
			let month = createDate.getMonth() + 1
			let day = createDate.getDate()
			let hour = createDate.getHours()
			let minute = createDate.getMinutes()
			let theDate = undefined
			for (let i = 0; i < events.length; i++) {
				if (events[i].title == `${month}月${day}日`) {
					theDate = events[i]
					break;
				}
			}
			if (!theDate) {
				theDate = {
					title: `${month}月${day}日`,
					items: []					
				}
				events.push(theDate)
			}
			theDate.items.push({
				date: `${hour}:${minute}`,
				message: event.title,
				detail: event.detail
			})
		})


		this.setState({events: events })		
	}

	render() {
		return (
			<div className={s.root}>
				<div className={s.title}>
					<span>公告：</span><span>系统试运行中</span>
				</div>
				<div className={s.content}>
					<div className={s.left}>
						{
							this.state.services.map(platform => {
								return <Platform key={platform.title} title={platform.title} groups={platform.groups}></Platform>
							})
						}
					</div>
					<div className={s.right}>
						<ListBox title="平台事件" groups={this.state.events} />
					</div>
				</div>
			</div>
		)
	}
}
