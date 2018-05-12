import React, {Component} from 'react';

class Header extends Component {

    render() {
        return (
            <div className="header" >
                <img className="header-logo" src="https://risebeyond.org/wp-content/uploads/2017/09/RISE-Logo-sq-e1505894300611.png" />
                <div className="header-title"><h1>Survey Results Dashboard</h1></div>
            </div>
        );
    }
}

export default Header;