import React, {Component} from 'react';

class TextInput extends Component {
    constructor() {
        super();
        this.state = {
            value: ""
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });

        this.props.handleChange(event.target.value)
    }

    render() {
        return (
            <input placeholder="set name" className={this.props.className} type="text" value={this.state.value} onChange={(event) => {this.handleChange(event)}} />
        )
    }
}

export default TextInput;