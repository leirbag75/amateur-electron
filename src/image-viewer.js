import React from 'react';

export default class ImageViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      relLike: null
    };
  }

  componentDidMount() {
    this.props.backend.loadImage(this.props.url, this);
  }

  like = () => {
    if(!this.state.relLike)
      throw new Error('Liking not enabled');
    this.props.backend.like(this.state.relLike, this);
  }

  enableLiking(url) {
    this.setState({relLike: url});
  }

  render() {
    return (
      <button className={`like-button ${this.state.relLike? 'active': ''}`} />
    );
  }

}
