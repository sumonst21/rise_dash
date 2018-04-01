import React, {Component} from 'react';
import { connect } from 'react-redux';

import { selectFilteredData } from "../../selectors/selectors";
import GenericDropdown from '../dropdown/generic_filter_dropdown';
import Chart from '../chart/chart';
import axios from "axios/index";

const API_URL = `${process.env.BASE_API_URL}/form_data/`;


function getHeaders () {
    return {
        'Authorization': `Token ${localStorage.token}`,
    }
}


class ChartComponent extends Component {

    constructor() {
        super();
        this.state = {
            unfilteredData:[],
            form: null,
            filteredData: [],
            calculationMethod: 'mean',
            consultantFilter: '',
            dateFilter: '',
            hasDate: false,
            hasConsultant: false,
        }
    };

    fetchFormData (formId) {
        const url = `${API_URL}${formId}/`;
        axios.get(url, {headers: getHeaders()}).then(
            (response) => {
                this.setState({
                    unfilteredData: response.data,
                    hasDate: response.data[0].hasOwnProperty('date_of_session'),
                    hasConsultant: response.data[0].hasOwnProperty('your_peer_learning_group')
                })
            }
        )
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state['form'] !== nextState['form']) {
            this.fetchFormData(nextState['form'])
        }
        nextState['filteredData'] = Boolean(nextState['filteredData']) ? selectFilteredData(nextState) : []
    }

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

    static mapForms(formsList) {
        return formsList.map(
            (form, index) => {
                return {'value': form.id, 'label': index + ' ' + form.name}
            }
        ).filter(n => n)
    }

    render () {
        const { formsList } = this.props;

        return (
            <div>
                <GenericDropdown data={ChartComponent.mapForms(formsList)}
                                 onChange={(v) => {this.setState({ form: v })}}
                                 placeholder="select a form"
                                 title="Form" />

                {Boolean(this.state.form) && <GenericDropdown data={['mean', 'nps']}
                                          onChange={(v) => {this.setState({ calculationMethod: v})}}
                                          placeholder="mean"
                                          title="Calculation"/>}

                {this.state.hasDate && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'date_of_session')}
                                                        onChange={(v) => {this.setState({ dateFilter: v })}}
                                                        placeholder="select a date"
                                                        title="Date"/>}
                {this.state.hasConsultant && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'your_peer_learning_group')}
                                                   onChange={(v) => {this.setState({ consultantFilter: v })}}
                                                   placeholder="select a name"
                                                   title="Consultant" />}

                <Chart formId={this.state.filteredData} calculation={this.state.calculationMethod} />

                {Boolean(this.state.filteredData.length) && <h4>Number of forms: {this.state.filteredData.length}</h4>}
            </div>
        );
    }
}

export default ChartComponent