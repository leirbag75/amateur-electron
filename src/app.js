import React from 'react';
import HomePage from './home-page';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: HomePage
    };
  }

  get currentPage() {
    return this.state.currentPage;
  }

  setPage(component) {
    this.setState({currentPage: component});
  }

  render() {
  }

}
