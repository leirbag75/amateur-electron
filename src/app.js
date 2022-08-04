import React from 'react';
import HomePage from './home-page';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: <HomePage url={this.props.url} backend={this.props.backend} />
    };
  }

  get currentPage() {
    return this.state.currentPage;
  }

  setPage(component) {
    this.setState({currentPage: component});
  }

  render() {
    return this.currentPage;
  }

}
