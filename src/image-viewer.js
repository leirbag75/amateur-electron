import React from 'react';

export default class ImageViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      relLike: null,
      relUnlike: null
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

  unlike = () => {
    if(!this.state.relUnlike)
      throw new Error('Unliking not enabled');
    this.props.backend.unlike(this.state.relUnlike, this);
  }

  enableLiking(url) {
    this.setState({relLike: url});
  }

  enableUnliking(url) {
    this.setState({relUnlike: url});
  }

  render() {
    return (
      <div>
        <button className={`like-button ${this.state.relLike? 'active': ''}`} />
        <button className={`unlike-button ${this.state.relUnlike? 'active': ''}`} />
      </div>
    );
  }

}
