import React, {Component} from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import ChartComponent from '../chart/chart_component';
import {fetchFilters} from "../../actions";


const blankChartState = {form: {value: null, label: null}, calculationMethod: 'mean', dateFilter: '', consultantFilter: ''};


class Main extends Component {
    constructor() {
        super();
        this.state = {
            charts: [Object.assign({id: 1}, blankChartState)],
        }
    };

    componentWillMount () {
        this.props.fetchFilters();
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

    selectOption(id, key, value) {
        let chartsCopy = this.state.charts.slice();
        let oldChart = null;

        for (let chart in chartsCopy) {
            if (chartsCopy[chart].id === id) {
                oldChart = chartsCopy[chart];
                break
            }
        }

        oldChart[key] = value;

        // if form is changing then reset filters
        if (key === 'form') {
            oldChart.dateFilter = '';
            oldChart.consultantFilter = '';
        }

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
                    <ChartComponent formsList={this.props.formList} id={item.id}
                                    form={item.form}
                                    calculationMethod={item.calculationMethod}
                                    dateFilter={item.dateFilter}
                                    consultantFilter={item.consultantFilter}
                                    selectOption={(id, key, value) => {this.selectOption(id, key, value)}}
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