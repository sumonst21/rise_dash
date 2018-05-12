import React, {Component} from 'react';

import { login } from './auth.js';


class Login extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    handleSubmit = (e) => {
        e.preventDefault();

        let username = this.refs.username.value;
        let pass = this.refs.pass.value;

        login(username, pass, (loggedIn) => {
                if (loggedIn) {
                    this.context.router.replace('/')
                }
            }
        )
    };

    render () {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        Username
                        <input type="text" placeholder="username" ref="username" />
                    </div>
                    <div>
                        Password
                        <input type="password" placeholder="password" ref="pass" />
                    </div>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

export default Login
