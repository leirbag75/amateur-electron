import React from 'react';
import HomePage from './home-page';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: <HomePage url={this.props.url} backend={this.props.backend} />
    };
  }

  pagesVisited = new Array();

  get currentPage() {
    return this.state.currentPage;
  }

  setPage(component) {
    this.pagesVisited.push(this.currentPage);
    this.setState({currentPage: component});
  }

  goBack = () => {
    this.setState({currentPage: this.pagesVisited.pop()});
  }

  render() {
    return <>
        {this.pagesVisited.length > 0 && <button className="back-button" onClick={this.goBack} />}
        {this.currentPage}
      </>
  }

}
