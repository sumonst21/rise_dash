import React, {Component} from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';

import ChartComponent from '../chart/chart_component';
import {fetchFilters} from "../../actions";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            charts: [{'id': 1}],
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

    renderCharts() {
        return this.state.charts.map((item) => {
            return (
                <div key={item.id} className="generic-card" >
                    <ChartComponent formsList={this.props.formList} />
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