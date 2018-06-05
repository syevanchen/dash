import React from 'react'
import autobind from 'autobind-decorator'

const Hover = ComposedComponent => class extends React.Component {

	state = {
		hover: false
	}

	@autobind
	handleMouseOver(e) {
		this.setState({
			hover: true // hover
		})
	}

	@autobind
	handleMouseOut(e) {
		this.setState({
			hover: false // default
		})
	}

	render() {
		return <ComposedComponent handleMouseOver={this.handleMouseOver}
								  handleMouseOut={this.handleMouseOut}
								  isHover={this.state.hover}
								  {...this.props} />;
	}
}

export default Hover