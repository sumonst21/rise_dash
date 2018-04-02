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
            filteredData: [],
            hasDate: false,
            hasConsultant: false,
            loading: false
        }
    };

    static renameOldFields(data) {
        // Some fields were called differently previously
        data.forEach((item) => {
            if (item.hasOwnProperty('your_peer_learning_group')) {
                item['consultant_name'] = item['your_peer_learning_group'];
                delete item['your_peer_learning_group'];
            }
        });
        return data
    }

    fetchFormData(formId) {
        const url = `${API_URL}${formId}/`;
        axios.get(url, {headers: getHeaders()}).then(
            (response) => {
                this.setState({
                    unfilteredData: ChartComponent.renameOldFields(response.data),
                    hasDate: response.data[0].hasOwnProperty('date_of_session'),
                    hasConsultant: response.data[0].hasOwnProperty('consultant_name'),
                    loading: false
                })
            }
        )
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.form !== nextProps.form) {
            this.setState({loading: true});
            this.fetchFormData(nextProps.form);
        }

        nextState['filteredData'] = Boolean(nextState['filteredData']) ? selectFilteredData({
            unfilteredData: nextState.unfilteredData,
            dateFilter: nextProps.dateFilter,
            consultantFilter: nextProps.consultantFilter
        }) : []
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
                                 onChange={(v) => {this.props.selectOption(this.props.id, 'form', v)}}
                                 value={this.props.form}
                                 placeholder="select a form"
                                 title="Form" />

                {Boolean(this.props.form) && <GenericDropdown data={['mean', 'nps']}
                                                              onChange={(v) => {this.props.selectOption(this.props.id, 'calculationMethod', v)}}
                                                              placeholder="mean"
                                                              value={this.props.calculationMethod}
                                                              title="Calculation"/>}

                {this.state.hasDate && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'date_of_session')}
                                                        onChange={(v) => {this.props.selectOption(this.props.id, 'dateFilter', v)}}
                                                        placeholder="select a date"
                                                        value={this.props.dateFilter}
                                                        title="Date"/>}

                {this.state.hasConsultant && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'consultant_name')}
                                                              onChange={(v) => {this.props.selectOption(this.props.id, 'consultantFilter', v)}}
                                                              placeholder="select a name"
                                                              value={this.props.consultantFilter}
                                                              title="Consultant" />}

                <Chart formId={this.state.filteredData} calculation={this.props.calculationMethod} loading={this.state.loading} />

                {Boolean(this.state.filteredData.length) && <h4>Number of forms: {this.state.filteredData.length}</h4>}
            </div>
        );
    }
}

export default ChartComponent