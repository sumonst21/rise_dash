import React, {Component} from 'react';

class Comments extends Component {

    buildComment (formItem) {
        let comments = [];

        Object.keys(formItem).forEach(
            (key) => {
                if (typeof formItem[key] === 'string' && key !== '_id') {
                    comments.push(
                        <p key={Math.random()} >{key}: {formItem[key]}</p>
                    )
                }
            }
        );

        return comments
    }

    buildComments () {
        return this.props.data.map((item) => {
            return (
                <div key={item._id}>
                    <p>Response ID: {item._id}</p>
                    <div>{this.buildComment(item)}</div>
                    <br/>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.buildComments()}
            </div>
        )
    }
}

export default Comments;