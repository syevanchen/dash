import React from 'react'
import go from 'gojs'
import autobind from 'autobind-decorator'
import fetch from '../../../../decorators/Fetch'
import ListBox from '../../../../components/ListBox'
import s from './Overview.scss'

const $ =  go.GraphObject.make

const STATUS_COLOR = (status) => {
	switch(status) {
	case 'UP':
		return '#27C701'
	case 'UP_HIGHLIGHT':
		return 'lime'
	case 'DOWN':
		return '#F1797A'
	case 'DOWN_HIGHLIGHT':
		return 'red'
	default:
		return '#ACB9C2'
	}
}

const HIGHLIGHT = (item) => {
	if (item.status == 'DOWN') {
		item.status = 'DOWN_HIGHLIGHT'
	} else if (item.status == 'DOWN_HIGHLIGHT') {
		item.status = 'DOWN'
	}
	if (item.status == 'UP') {
		item.status = 'UP_HIGHLIGHT'
	} else if (item.status == 'UP_HIGHLIGHT') {
		item.status = 'UP'
	}	
}

const NODE_INFO = (data) => {
	return '【服务地址】\n' + data.hosts + '\n' + '【服务信息】\n' + data.info
}

const FORMAT_HOSTS = (hosts) => {
	hosts.forEach()
}

const testData = {
	nodeDataArray: [
		{ key: 'mgwcore-643032428', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-643032421', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-643032422', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-643032423', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-643032424', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-643032425', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-dev-1428277366', status: 'UP', group: '服务集群' },
		{ key: 'mgwcore-dev-972036500', status: 'DOWN', group: '服务集群' },
		{ key: 'configServer', status: 'UP', group: '后端服务' },
		{ key: 'redis', status: '', group: '后端服务' },
		{ key: 'MySQL', status: 'UP', group: '后端服务' },
		{ key: '服务集群', isGroup: true },
		{ key: '后端服务', isGroup: true }
	],
	linkDataArray: [
		{ from: 'mgwcore-dev-1428277366', to: 'configServer', status: 'UP' },
		{ from: 'mgwcore-dev-1428277366', to: 'redis', status: 'DOWN' },
		{ from: 'mgwcore-dev-1428277366', to: 'MySQL', status: 'UP' },
		{ from: 'mgwcore-dev-972036500', to: 'configServer', status: 'UP' },
		{ from: 'mgwcore-dev-972036500', to: 'MySQL', status: 'UNKNOWN' },
		{ from: 'mgwcore-dev-972036500', to: 'redis', status: 'UP' }
	]
}

@fetch
export default class Overview extends React.Component {

	state = {
		events: []
	}

	constructor(props) {
		super(props)
	}

	componentWillMount() {
		// TODO
	}

	componentDidMount() {

		this.props.fetch(`/api/v1/service/summary/${this.props.params.serviceId}`, this.fetch)()
		this.props.fetch(`/api/v1/service/events/${this.props.params.serviceId}`, this.fetchEvents)()

	}

	componentWillUnmount() {
		// diagram.clear()
	}

	render() {
		return (
			<div className={s.root}>
				<div id="mainCanvas" className={s.left}></div>
				<div className={s.right}>
					<ListBox title="服务事件" groups={this.state.events}>
					</ListBox>
				</div>
			</div>
		)
	}

	@autobind
	fetch(data) {

		let topology = {
			nodeDataArray: [],
			linkDataArray: []
		}

		data.levels.map(group => {
			topology.nodeDataArray.push({
				key: group.name,
				isGroup: true
			})
			group.nodes.map(node => {
				topology.nodeDataArray.push({
					key: node.name,
					status: node.status,
					group: group.name,
					hosts: node.hosts,
					info: JSON.stringify(node.details, null, 2)
				})
				if (Array.isArray(node.links)) {
					node.links.map(link => {
						topology.linkDataArray.push({
							from: node.name,
							to: link.nodeName,
							status: link.status
						})
					})
				}
			})
		})

		// this.setState({ data: topology })

		const diagram = $(go.Diagram, 'mainCanvas')

		diagram.initialContentAlignment = go.Spot.Center
		// diagram.isEnabled = false
		diagram.isReadOnly = true

	 	diagram.nodeTemplate = $(go.Node, "Vertical", { /* fromEndSegmentLength: 0, */ toEndSegmentLength: 0, fromSpot: go.Spot.BottomSide, toSpot: go.Spot.TopSide },
  			$(go.Picture, { source: '/i/server.png', width: 64, height: 64, margin: new go.Margin(0,0,10,0) },
  				new go.Binding('background', 'status', STATUS_COLOR)),
      		$(go.TextBlock, new go.Binding('text', 'key')),
      		{
      			toolTip: $(go.Adornment, 'Auto', 
      						$(go.Shape, {fill: 'lightyellow'}),
      						$(go.TextBlock, {margin: 4, font: 'normal 9px Georgia, Consolas, 微软雅黑'},
      							new go.Binding('text', '', NODE_INFO)))
      		}
    	)  // end Node

	 	diagram.groupTemplate = $(go.Group, "Horizontal", { layout: $(go.GridLayout, {wrappingColumn: 4})},
	 		$(go.TextBlock,	{ margin: 10 }, new go.Binding('text', 'key')),
	 		$(go.Panel, 'Auto',
	 			$(go.Shape, 'Rectangle', { fill: null, stroke: 'black', strokeWidth: 1 }),
	 			$(go.Panel, 'Horizontal', $(go.Placeholder, { padding: 10 }))
	 		)
	 	)

        diagram.linkTemplate = $(go.Link,
          	$(go.Shape, { strokeWidth: 2 },
      			new go.Binding('stroke', 'status', STATUS_COLOR)),
        )

		diagram.layout = $(go.TreeLayout, { angle: 90, setsPortSpot: false })
		diagram.toolManager.hoverDelay = 100

		let model = $(go.GraphLinksModel)
		// model.nodeDataArray = testData.nodeDataArray
		// model.linkDataArray = testData.linkDataArray

		// console.log(topology.nodeDataArray)
		// console.log(topology.linkDataArray)

		model.nodeDataArray = topology.nodeDataArray
		model.linkDataArray = topology.linkDataArray

		diagram.model = model

		let problem = () => {
			let model = diagram.model
			model.nodeDataArray.forEach((e) => {
				HIGHLIGHT(e)
				model.updateTargetBindings(e)
			})
			model.linkDataArray.forEach((e) => {
				HIGHLIGHT(e)
				model.updateTargetBindings(e)
			})
		}

		let loop = () => {
			setTimeout(function() { problem(); loop(); }, 1000)
		}

		loop()
	}

	@autobind
	fetchEvents(data) {

		let events = []

		data.forEach(event => {
			let month = new Date(event.createDate).getMonth() + 1
			let day = new Date(event.createDate).getDate()
			let theMonth = undefined
			for (let i = 0; i < events.length; i++) {
				if (events[i].title == `${month}月`) {
					theMonth = events[i]
					break;
				}
			}
			if (!theMonth) {
				theMonth = {
					title: `${month}月`,
					items: []					
				}
				events.push(theMonth)
			}
			theMonth.items.push({
				date: `${month}.${day}`,
				message: event.title,
				detail: event.detail
			})
		})


		this.setState({events: events })
	}
}
