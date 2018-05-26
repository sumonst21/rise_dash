import React, {Component} from 'react';
import Dropdown from 'react-dropdown';


class GenericDropdown extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: null,
            options: {}
        };
        this._onSelect = this._onSelect.bind(this)
    }

    _onSelect (option) {
        this.props.onChange(option);
        this.setState({
            selected: option.label
        })
    }

    render () {
        if (this.props.value !== undefined) {
            return (
                <div className="dropdown-block">
                    <Dropdown value={this.props.value}
                              options={this.props.data}
                              onChange={this._onSelect}
                              className="dropdown-dropdown"
                              placeholder={this.props.placeholder}/>
                </div>
            );
        } else {
            return (
                <div className="dropdown-block">
                    <Dropdown options={this.props.data}
                              onChange={this._onSelect}
                              className="dropdown-dropdown"
                              placeholder={this.props.placeholder}/>
                </div>
            );
        }
    }
}

export default GenericDropdown;