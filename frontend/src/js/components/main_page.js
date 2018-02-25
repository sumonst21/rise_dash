import React, {Component} from 'react';
import {connect} from 'react-redux';
import Header from './header/header';

class MainPage extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className="parent">
                <Header />
                <div className="main-content">
                    { children }
                </div>
                <div className="footer">Rise Beyond © 2018</div>
            </div>
        );
    }
}

export default MainPage