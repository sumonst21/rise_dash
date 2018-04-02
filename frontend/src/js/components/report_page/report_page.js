import React, {Component} from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import ChartComponent from '../chart/chart_component';
import {fetchFilters} from "../../actions";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            charts: [{'id': 1, 'form': null, calculationMethod: 'mean', dateFilter: '', consultantFilter: ''}],
        }
    };

    componentWillMount () {
        this.props.fetchFilters();
    }

    handleMoreChartsClick () {
        this.setState({ charts: this.state.charts.concat([{'id': uuid.v4()}])})
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
                    <ChartComponent formsList={this.props.formList} id={item.id}
                                    form={item.form}
                                    calculationMethod={item.calculationMethod}
                                    dateFilter={item.dateFilter}
                                    consultantFilter={item.consultantFilter}
                                    selectOption={(id, key, value) => {this.selectOption(id, key, value)}} />
                    <button onClick={() => {return this.handleLessChartsClick(item.id)}} >Remove</button>
                </div>
            );
        });
    }

    render () {
        return (
            <div>
                {this.renderCharts()}
                <button onClick={() => {return this.handleMoreChartsClick()}} >Add Chart</button>
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