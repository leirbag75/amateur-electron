import React from 'react';
import Resource from './resource';
import Tag from './tag';

export default class ImageViewer extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      relLike: null,
      relUnlike: null,
      src: '',
      tags: []
    };
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

  setSrc(src) {
    this.setState({src: src})
  }

  setTags(tags) {
    this.setState({tags: [...tags]});
  }

  render() {
    return (
      <div>
        <img className="image-viewed" src={this.state.src} />
        <button
          className={`like-button ${this.state.relLike? 'active': ''}`}
          onClick={this.like}
        />
        <button
          className={`unlike-button ${this.state.relUnlike? 'active': ''}`}
          onClick={this.unlike}
        />
        <div className="tag-list">
          {this.state.tags.map(tag => <Tag
             key={tag.href} backend={this.props.backend} embed={tag.embed}
          />)}
        </div>
      </div>
    );
  }

}
