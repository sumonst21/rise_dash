import React, {Component} from 'react';
import { connect } from 'react-redux';

import ChartComponent from '../chart/chart_component';
import {fetchFilters} from "../../actions";


class Main extends Component {
    constructor() {
        super();
        this.state = {
            charts: [<ChartComponent formsList={this.props.formList} />],
        }
    };

    componentWillMount () {
        this.props.fetchFilters();
    }

    handleMoreChartsClick () {
        console.log('hello')
    }

    render () {
        return (
            <div>
                <ChartComponent formsList={this.props.formList} />
                <button onClick={this.handleMoreChartsClick} >Add Chart</button>
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