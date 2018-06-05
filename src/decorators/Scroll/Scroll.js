import React from 'react'
import autobind from 'autobind-decorator'

const Scroll = ComposedComponent => class extends React.Component {

	state = {
		outerEl: window,
		lastFetchSize: 0,
		fetchSize: 60,
		bufferSize: 30,
		dataSize: 0,
		headerHeight: 0,
		itemHeight: 40,
		fetchCallback: () => undefined
	}

	componentDidMount() {
		this.state.outerEl.addEventListener('scroll', this.handleScroll)
	}

	componentWillUnmount() {
		this.state.outerEl.removeEventListener('scroll', this.handleScroll)
	}

	@autobind
	handleScroll(e) {
		if (this.state.lastFetchSize < this.state.fetchSize) {
			return
		}

		let gap = this.state.dataSize - this.lastItemIndex(e.srcElement.scrollTop, e.srcElement.offsetHeight)

		if (gap > 0 && gap < BUFFER_SIZE) {
			this.state.fetchCallback()
		}
	}

	@autobind
	init(outerEl, fetchSize, bufferSize, headerHeight, itemHeight, fetchCallback) {
		this.setState({
			outerEl: outerEl,
			fetchSize: fetchSize,
			bufferSize: bufferSize,
			headerHeight: headerHeight,
			itemHeight: itemHeight,
			fetchCallback: fetchCallback
		})
	}

	@autobind
	update(lastFetchSize, dataSize) {
		this.setState({
			lastFetchSize: lastFetchSize,
			dataSize: dataSize
		})
	}

	@autobind
	lastItemIndex(top, height) {
		return Math.round((top + height - this.state.headerHeight) / this.state.itemHeight)
	}

	render() {
		return <ComposedComponent {...this.props} initScroll={this.init} updateScroll={this.update} />;
	}
}

export default Scroll