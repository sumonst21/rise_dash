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
        this.props.onChange(option.value);
        this.setState({
            selected: option.label
        })
    }

    render () {
        return (
            <div className="dropdown-block">
                <h3 className="dropdown-label">{this.props.title}: </h3><Dropdown value={this.state.selected}
                                                                                  options={this.props.data}
                                                                                  onChange={this._onSelect}
                                                                                  className="dropdown-dropdown"
                                                                                  placeholder={this.props.placeholder} />
            </div>
        );
    }
}

export default GenericDropdown;