import React, {Component} from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import ChartComponent from '../chart/chart_component';
import {fetchFilters} from "../../actions";


const blankChartState = {
    form: {value: null, label: null},
    calculationMethod: 'mean',
    datasets: [{
        dateFilter: '',
        consultantFilter: '',
        genericFilters: {},
        background: "rgba(213, 50, 99, 0.3)",
        border: "rgba(213, 50, 99, 0.8)",
    }]
};


function rgba(r, g, b, alpha) {
    let o = Math.round, s = 255;
    return 'rgba(' + o(r*s) + ',' + o(g*s) + ',' + o(b*s) + ',' + alpha + ')';
}

function generateColours() {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return {border: rgba(r, g, b, 0.8), background: rgba(r, g, b, 0.3)}
}


class Main extends Component {
    constructor() {
        super();
        this.state = {
            charts: [Object.assign({id: 1}, blankChartState)],
        }
    };

    componentWillMount() {
        this.props.fetchFilters();
    }

    handleMoreDatasetsClick(id) {
        let charts = this.state.charts.slice();

        charts.map(
            (chart) => {
                if (chart.id === id) {
                    const { border, background } = generateColours();

                    chart.datasets = [...chart.datasets, {
                        dateFilter: '',
                        consultantFilter: '',
                        genericFilters: {},
                        border: border,
                        background: background
                    }];
                }
            }
        );

        this.setState({charts: charts})
    }


    handleMoreChartsClick () {
        this.setState({ charts: this.state.charts.concat([Object.assign({id: uuid.v4()}, blankChartState)])})
    }

    handleLessChartsClick(id) {
        this.setState({
            charts: this.state.charts.filter((value) => {
                return value.id !== id;
            })
        })
    }

    selectOption(chartId, datasetIndex, key, value) {
        let chartsCopy = this.state.charts.slice();
        let oldChart = null;

        for (let chart in chartsCopy) {
            if (chartsCopy[chart].id === chartId) {
                oldChart = chartsCopy[chart];
                break
            }
        }

        // if form is changing then reset filters
        if (key === 'form') {
            Object.assign(oldChart, {
                form: value,
                calculationMethod: 'mean',
                datasets: [{
                    dateFilter: '',
                    consultantFilter: '',
                    genericFilters: {},
                    background: "rgba(213, 50, 99, 0.3)",
                    border: "rgba(213, 50, 99, 0.8)",
                }]
            });
        } else if (key === 'calculationMethod') {
            oldChart.calculationMethod = value
        } else {
            oldChart['datasets'][datasetIndex][key] = value;
        }

        this.setState({charts: chartsCopy});
    }

    selectFilter(chartId, datasetIndex, key, value) {
        let chartsCopy = this.state.charts.slice();
        let oldChart = null;

        for (let chart in chartsCopy) {
            if (chartsCopy[chart].id === chartId) {
                oldChart = chartsCopy[chart];
                break
            }
        }

        oldChart['datasets'][datasetIndex]['genericFilters'][key] = value;
        this.setState({charts: chartsCopy})
    }

    renderCharts() {
        return this.state.charts.map((item) => {
            return (
                <div key={item.id} className="generic-card" >
                    <button className="generic-card-close btn-floating cyan" onClick={() => {return this.handleLessChartsClick(item.id)}} >
                        <i className="material-icons">
                            close
                        </i>
                    </button>
                    <button onClick={() => {this.handleMoreDatasetsClick(item.id)}}> new ds </button>
                    <ChartComponent formsList={this.props.formList} id={item.id}
                                    form={item.form}
                                    datasets={item.datasets}
                                    calculationMethod={item.calculationMethod}
                                    selectGenericFilter={(chartId, datasetIndex, key, value) => {this.selectFilter(chartId, datasetIndex, key, value)}}
                                    selectOption={(chartId, datasetIndex, key, value) => {this.selectOption(chartId, datasetIndex, key, value)}}
                    />
                </div>
            );
        });
    }

    render () {
        return (
            <div>
                {this.renderCharts()}
                <button className="new-chart-button btn-floating cyan" onClick={() => {return this.handleMoreChartsClick()}} >
                    <i className="material-icons">
                        add
                    </i>
                </button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        formList: state.filters.results
    };
}

export default connect(mapStateToProps, { fetchFilters })(Main);