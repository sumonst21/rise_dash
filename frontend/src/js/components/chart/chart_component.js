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
            filteredDatasets: [],
            hasDate: false,
            hasConsultant: false,
            loading: false,
            showComments: false,
            filterableKeys: new Set(),
            showFiltersets: []
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

    fetchFormData(formId, datasets) {
        const url = `${API_URL}${formId}/`;
        axios.get(url, {headers: getHeaders()}).then(
            (response) => {
                let unfilteredData = ChartComponent.renameOldFields(response.data);

                this.setState({
                    unfilteredData: unfilteredData,
                    hasDate: response.data[0].hasOwnProperty('date_of_session'),
                    hasConsultant: response.data[0].hasOwnProperty('consultant_name'),
                    filterableKeys: ChartComponent.getFilterableKeys(response.data),
                    loading: false,
                    filteredDatasets: datasets.map((dataset) => {return this.filterData(dataset, unfilteredData)})
                })
            }
        )
    }


    filterData(dataset, unfilteredData) {
        let data = selectFilteredData({
            unfilteredData: unfilteredData,
            dateFilter: dataset.dateFilter,
            consultantFilter: dataset.consultantFilter,
            genericFilters: dataset.genericFilters
        });
        return {
            data: data,
            background: dataset.background,
            border: dataset.border
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.form.value !== nextProps.form.value) {
            this.setState({loading: true});
            this.fetchFormData(nextProps.form.value, nextProps.datasets);
        } else {
            this.setState({filteredDatasets: nextProps.datasets.map((dataset) => {return this.filterData(dataset, this.state.unfilteredData)})})
        }
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

    handleShowFilters(filterset) {
        this.setState(
            {
                showFiltersets: this.state.showFiltersets.includes(filterset) ? this.state.showFiltersets.filter(
                    (x) => {return x !== filterset}
                ) : this.state.showFiltersets.concat([filterset])
            }
        )
    }

    renderFilters(dataset, index) {
        return (
            <div key={index} >
                <button className={"filterset-button waves-effect btn cyan"} onClick={() => {this.handleShowFilters(index)}} >
                    <i className="text-icon-fix material-icons right" style={{color: dataset.border}}> brightness_1 </i>
                    filterset {index}
                </button>

                {this.state.showFiltersets.includes(index) && <div>
                    {this.state.hasDate &&
                    <GenericDropdown data={this.extractFromData(dataset.data, 'date_of_session')}
                                     onChange={(v) => {
                                         this.props.selectOption(this.props.id, index, 'dateFilter', v.value)
                                     }}
                                     placeholder="select a date"
                                     value={this.props.datasets[index].dateFilter}
                                     title="Date"/>}

                    {this.state.hasConsultant &&
                    <GenericDropdown data={this.extractFromData(dataset.data, 'consultant_name')}
                                     onChange={(v) => {
                                         this.props.selectOption(this.props.id, index, 'consultantFilter', v.value)
                                     }}
                                     placeholder="select a name"
                                     value={this.props.datasets[index].consultantFilter}
                                     title="Consultant"/>}

                    {this.state.filterableKeys.has('user') &&
                    <GenericDropdown data={this.extractFromData(dataset.data, 'user')}
                                     onChange={(v) => {
                                         this.props.selectGenericFilter(this.props.id, index, 'user', v.value)
                                     }}
                                     placeholder="select a user"
                                     value={this.props.datasets[index].genericFilters.user}
                                     title="user"/>}

                    {this.state.filterableKeys.has('exec_member') &&
                    <GenericDropdown data={this.extractFromData(dataset.data, 'exec_member')}
                                     onChange={(v) => {
                                         this.props.selectGenericFilter(this.props.id, index, 'exec_member', v.value)
                                     }}
                                     placeholder="select a participant"
                                     value={this.props.datasets[index].genericFilters.exec_member}
                                     title="Participant"/>}

                </div>}
            </div>
        )
    }


    render () {
        const { formsList } = this.props;

        return (
            <div>
                {this.props.form.value &&
                <button
                    className="generic-card-close btn-floating cyan"
                    onClick={() => {
                        this.setState({loading: true});
                        this.fetchFormData(this.props.form.value, this.props.datasets)
                    }}
                    title={"refresh chart data"}
                >
                    <i className="material-icons">
                        refresh
                    </i>
                </button>}
                <GenericDropdown data={ChartComponent.mapForms(formsList)}
                                 onChange={(v) => {this.props.selectOption(this.props.id, 0, 'form', v)}}
                                 value={this.props.form.label}
                                 placeholder="select a form"
                                 title="Form" />

                {Boolean(this.props.form.value) &&
                <GenericDropdown data={['mean', 'nps']}
                                 onChange={(v) => {
                                     this.props.selectOption(this.props.id, 0, 'calculationMethod', v.value)
                                 }}
                                 placeholder="mean"
                                 value={this.props.calculationMethod}
                                 title="Calculation"/>}

                {this.props.form.value && <div className={"generic-card-filterset"}>
                    {
                        this.state.filteredDatasets.map((dataset, index) => {
                            return this.renderFilters(dataset, index)
                        })
                    }
                </div>}

                {this.props.form.value && <Chart formId={this.state.filteredDatasets} calculationMethod={this.props.calculationMethod}
                       loading={this.state.loading}/>}

                {Boolean(this.state.unfilteredData.length) && <button
                    className="waves-effect btn cyan" onClick={() => {
                    return this.handleShowComments()
                }}><i className="text-icon-fix material-icons right">{this.state.showComments ? 'expand_less' : 'expand_more'}</i> Comments</button>}

                {this.state.showComments && <Comments data={this.state.unfilteredData}/>}

            </div>
        );
    }
}

export default ChartComponent