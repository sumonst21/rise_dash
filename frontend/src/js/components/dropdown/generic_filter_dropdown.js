import React, {Component} from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import _ from 'lodash';


class GenericDropdown extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: null,
            options: {}
        };
        this._onSelect = this._onSelect.bind(this)
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('recieving props');
    //     if (nextProps.data && ! _.isEqual(nextProps.data, this.props.data)) {
    //         this.setState({...this.state, selected: null});
    //     }
    // }

    _onSelect (option) {
        this.props.onChange(option.value);
        this.setState({
            selected: option.value
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