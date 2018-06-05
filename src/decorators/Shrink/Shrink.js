import React from 'react'
import autobind from 'autobind-decorator'

const Shrink = ComposedComponent => class extends React.Component {

	state = {
		shrink: false
	}

	@autobind
	handleShrink(e) {
		this.setState({
			shrink: !this.state.shrink
		})
	}

	render() {
		return <ComposedComponent {...this.props} handleShrink={this.handleShrink} isShrink={this.state.shrink} />;
	}
}

export default Shrink