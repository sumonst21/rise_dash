import React, {Component} from 'react';
import { Bar } from 'react-chartjs-2';

const allowedCategories = {
    'participation': {
        'border': 'rgba(213, 50, 99, 0.8)',
        'background': 'rgba(213, 50, 99, 0.3)'
    },
    'facilitation': {
        'border': 'rgba(129, 210, 209, 1)',
        'background': 'rgba(129, 210, 209, 0.3)'
    },
    'designcontent': {
        'border': 'rgba(213, 50, 99, 0.8)',
        'background': 'rgba(213, 50, 99, 0.3)'
    },
    'no_category': {
        'border': 'rgba(129, 210, 209, 1)',
        'background': 'rgba(129, 210, 209, 0.3)'
    }
};


class Chart extends Component{
    constructor (props) {
        super(props);
        this.state ={
            chartData: {
                labels: ['a', 'b'],
                datasets: [{
                    label: "d1",
                    data:[2, 5],
                    backgroundColor: "rgba(213, 50, 99, 0.3)",
                    borderColor: "rgba(213, 50, 99, 0.8)",
                    borderWidth: 2
                }],
            }
        }
    }

    extractData (rawData) {
        let values = {};

        for (let i = 0; i < rawData.length; i++) {
            for (let property in rawData[i]) {
                if (rawData[i].hasOwnProperty(property)) {

                    let category = property.split('_')[0];

                    if (!(Object.keys(allowedCategories).includes(category))) {
                        category = 'no_category'
                    }
                    // else {
                    //     console.log(property)
                    //     let word_list = property.split('_');
                    //     word_list.shift();
                    //     property = word_list.join('_');
                    //     console.log(property)
                    // }

                    if (values[category] === undefined ) {
                        values[category] = {}
                    }

                    if (Number.isInteger(rawData[i][property])) {
                        if (values[category][property] !== undefined) {
                            values[category][property] = {
                                count: values[category][property]['count'] + 1,
                                score: values[category][property]['score'] + rawData[i][property]
                            }
                        } else {
                            values[category][property] = {count: 1, score: rawData[i][property]}
                        }
                    }
                }
            }
        }
        return values
    }

    group_data (dataDict) {
        let data = [];
        let labels = [];
        let backgroundColors = [];
        let borderColors = [];

        let index = 0;
        for (let key in dataDict) {
            if (dataDict.hasOwnProperty(key)) {
                const labelSet = Object.keys(dataDict[key]).map(
                    (item) => {
                        backgroundColors.push(allowedCategories[key]['background']);
                        borderColors.push(allowedCategories[key]['border']);
                        return item.split('_')
                    }
                );
                const dataSet = Object.values(dataDict[key]);

                labels.push(...labelSet);
                data.push(...dataSet);
            }
            index += 1
        }

        return {
            data,
            labels,
            backgroundColors,
            borderColors
        }
    }

    componentWillReceiveProps (nextProps) {
        const values = this.extractData(nextProps.formId);
        const groupedData = this.group_data(values);

        let chartData = Object.assign({}, this.state.chartData);

        chartData.labels = groupedData.labels;
        chartData.datasets[0].data = Object.values(groupedData.data).map(
                item => {
                    return item.score / item.count
                }
            );
        chartData.datasets[0].backgroundColor = groupedData.backgroundColors;
        chartData.datasets[0].borderColor = groupedData.borderColors;

        this.setState({chartData: chartData})

    }

    render () {
        const options = {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    stacked: false,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        min: 0,
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]

            }
        };

        return (
            <div className="chart">
                {Boolean(this.props.formId.length) && <Bar data={this.state.chartData}
                                                    options={options}/>}
            </div>
        )
    }
}

export default Chart;