import React, { Component } from 'react';


class AppTitle extends Component {
    state = {
        activeTitle: undefined
    }

    componentDidMount() {
        const titles = ['🏓', 'Ping pong', 'Tafeltennis', 'Pong ping'];

        this.setState({activeTitle: titles[Math.ceil(Math.random() * titles.length -1)]})
    }
    render() {
        return (
            <span>{this.state.activeTitle || ''} ranking</span>
        );
    }
}

export default AppTitle