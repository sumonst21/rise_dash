import React, {Component} from 'react';

import { selectFilteredData } from "../../selectors/selectors";
import GenericDropdown from '../dropdown/generic_filter_dropdown';
import Chart from '../chart/chart';
import axios from "axios/index";
import Comments from './comments';

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
            loading: false,
            showComments: false,
            filterableKeys: new Set()
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


    static getFilterableKeys(data) {
        let keys = new Set();

        data.forEach((item) => {
            let newKeySet = new Set(Object.keys(item));
            keys = new Set([...keys, ...newKeySet])
        });

        return keys
    }

    fetchFormData(formId) {
        const url = `${API_URL}${formId}/`;
        axios.get(url, {headers: getHeaders()}).then(
            (response) => {
                this.setState({
                    unfilteredData: ChartComponent.renameOldFields(response.data),
                    hasDate: response.data[0].hasOwnProperty('date_of_session'),
                    hasConsultant: response.data[0].hasOwnProperty('consultant_name'),
                    filterableKeys: ChartComponent.getFilterableKeys(response.data),
                    loading: false
                })
            }
        )
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.form.value !== nextProps.form.value) {
            this.setState({loading: true});
            this.fetchFormData(nextProps.form.value);
        }

        nextState['filteredData'] = Boolean(nextState['filteredData']) ? selectFilteredData({
            unfilteredData: nextState.unfilteredData,
            dateFilter: nextProps.dateFilter,
            consultantFilter: nextProps.consultantFilter,
            genericFilters: nextProps.genericFilters
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
    };

    handleShowComments () {
        this.setState({
            showComments: !this.state.showComments
        })
    }

    render () {
        const { formsList } = this.props;

        return (
            <div>
                <button className="generic-card-close btn-floating cyan" onClick={() => {
                    this.setState({loading: true});
                    this.fetchFormData(this.props.form.value)
                }} >
                    <i className="material-icons">
                        refresh
                    </i>
                </button>
                <GenericDropdown data={ChartComponent.mapForms(formsList)}
                                 onChange={(v) => {this.props.selectOption(this.props.id, 'form', v)}}
                                 value={this.props.form.label}
                                 placeholder="select a form"
                                 title="Form" />

                {Boolean(this.state.filteredData.length) && <GenericDropdown data={['mean', 'nps']}
                                                              onChange={(v) => {this.props.selectOption(this.props.id, 'calculationMethod', v.value)}}
                                                              placeholder="mean"
                                                              value={this.props.calculationMethod}
                                                              title="Calculation"/>}

                {this.state.hasDate && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'date_of_session')}
                                                        onChange={(v) => {this.props.selectOption(this.props.id, 'dateFilter', v.value)}}
                                                        placeholder="select a date"
                                                        value={this.props.dateFilter}
                                                        title="Date"/>}

                {this.state.hasConsultant && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'consultant_name')}
                                                              onChange={(v) => {this.props.selectOption(this.props.id, 'consultantFilter', v.value)}}
                                                              placeholder="select a name"
                                                              value={this.props.consultantFilter}
                                                              title="Consultant" />}

                {this.state.filterableKeys.has('user') && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'user')}
                                                                           onChange={(v) => {
                                                                               this.props.selectGenericFilter(this.props.id, 'user', v.value)
                                                                           }}
                                                                           placeholder="select a user"
                                                                           value={this.props.genericFilters.user}
                                                                           title="user"/>}

                {this.state.filterableKeys.has('exec_member') && <GenericDropdown data={this.extractFromData(this.state.filteredData, 'exec_member')}
                                                                                       onChange={(v) => {
                                                                                           this.props.selectGenericFilter(this.props.id, 'exec_member', v.value)
                                                                                       }}
                                                                                       placeholder="select a participant"
                                                                                       value={this.props.genericFilters.exec_member}
                                                                                       title="Participant"/>}

                <Chart formId={this.state.filteredData} calculation={this.props.calculationMethod}
                       loading={this.state.loading}/>

                {Boolean(this.state.filteredData.length) && <h4>Number of forms: {this.state.filteredData.length}</h4>}

                {Boolean(this.state.filteredData.length) && <button
                    className="waves-effect btn cyan" onClick={() => {
                    return this.handleShowComments()
                }}><i className="text-icon-fix material-icons right">{this.state.showComments ? 'expand_less' : 'expand_more'}</i> Comments</button>}

                {this.state.showComments && <Comments data={this.state.filteredData}/>}

            </div>
        );
    }
}

export default ChartComponent