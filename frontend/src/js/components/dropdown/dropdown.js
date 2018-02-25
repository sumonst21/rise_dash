import React, {Component} from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';

import { fetchFilters, selectForm } from '../../actions/index';


class FormNameFilterDropdown extends Component {
    constructor (props) {
        super(props);
        this._onSelect = this._onSelect.bind(this)
    }

    componentWillMount () {
        this.props.fetchFilters();
    }

    _onSelect (option) {
        this.props.selectForm(option.value)
    }

    render () {
        if (!this.props.forms) {
            return <div>Loading.....</div>;
        }

        return (
            <div>
                <Dropdown options={
                    this.props.forms.map(
                        (form, index) => {
                            return {'value': form.id, 'label': index + ' ' + form.name}
                        }
                    ).filter(n => n)
                } onChange={this._onSelect} placeholder="Select a form name" />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        forms: state.filters.results
    };
}

export default connect(mapStateToProps, { fetchFilters, selectForm })(FormNameFilterDropdown);