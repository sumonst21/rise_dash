import React, {Component} from 'react';

class Comments extends Component {

    buildComment (formItem) {
        let comments = [];

        Object.keys(formItem).forEach(
            (key) => {
                if (typeof formItem[key] === 'string' && key !== '_id') {
                    comments.push(
                        <p key={Math.random()} >{key.split('_').join(' ')}: {formItem[key]}</p>
                    )
                }
            }
        );

        return comments
    }

    buildComments (data) {
        return data.map((item) => {
            return (
                <div key={item._id}>
                    {/*<p>Response ID: {item._id}</p>*/}
                    <div>{this.buildComment(item)}</div>
                    <br/>
                </div>
            )
        })
    }

    buildDatasetComments () {
        return this.props.datasets.map((dataset, index) => {
            return (
                <div key={index}>
                    {dataset.name ? dataset.name : $`dataset {index}`}
                    {this.buildComments(dataset.data)}
                </div>
            )
        })
    }

    render() {
        return (
            <div className={"card-comments"}>
                {this.buildDatasetComments()}
            </div>
        )
    }
}

export default Comments;