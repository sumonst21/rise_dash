import React, {Component} from 'react';
import { connect } from 'react-redux';

import { selectFilteredData } from "../../selectors/selectors";
import FormNameFilterDropdown from '../dropdown/dropdown';
import GenericDropdown from '../dropdown/generic_filter_dropdown';
import Chart from '../chart/chart';
import { selectDate, selectConsultant, selectCalculation } from '../../actions/index';


class Main extends Component {


    extractFromData = (data, key_name) => {
        const options = [...new Set(data.map((item) => {
            return item[key_name]
        }))];

        const v = options.map((item) => {
            if (item == null) {
                return {value: 'null_value', label: 'null_value'}
            }
            return {value: item, label: item}
        });

        return [...v, {value: 'no_filter', label: 'no filter'}]
    };

    render () {
        const { hasDate, form, filtered, hasConsultant } = this.props;

        return (
            <div>
                <div className="generic-card">
                    <FormNameFilterDropdown/>
                    {hasDate && <GenericDropdown data={this.extractFromData(this.props.filtered, 'date_of_session')}
                                                 onChange={this.props.selectDate}
                                                 placeholder="select a date"
                                                 title="Date" />}
                    {hasConsultant && <GenericDropdown data={this.extractFromData(this.props.filtered, 'your_peer_learning_group')}
                                                       onChange={this.props.selectConsultant}
                                                       placeholder="select a name"
                                                       title="Consultant" />}
                    {form && <GenericDropdown data={['mean', 'nps']}
                                              onChange={this.props.selectCalculation}
                                              placeholder="mean"
                                              title="Calculation"/>}
                    <Chart formId={filtered} />

                    {Boolean(this.props.filtered.length) && <h4>Number of forms: {this.props.filtered.length}</h4>}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        hasDate: state.filters.hasDate,
        hasConsultant: state.filters.hasConsultant,
        form: state.filters.form,
        filtered: selectFilteredData(state)
    };
}

export default connect(mapStateToProps, { selectDate, selectConsultant, selectCalculation })(Main);