import React from 'react';
import Resource from './resource';
import Tag from './tag';
import * as Reader from './readers';

let readers = [
  new Reader.LinkReader('like', 'enableLiking'),
  new Reader.LinkReader('unlike', 'enableUnliking'),
  new Reader.FieldReader('src', 'setSrc'),
  new Reader.LinkListReader('tag', 'setTags'),
  new Reader.FieldReader('likes', 'setLikes')
];

export default class ImageViewer extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      relLike: null,
      relUnlike: null,
      src: '',
      tags: [],
      likes: 0
    };
  }

  readers() {
    return readers;
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

  setLikes(likes) {
    this.setState({likes});
  }

  render() {
    return (
      <div>
        <img className="image-viewed" src={this.state.src} />
        <button
          className={`like-button ${this.state.relLike? 'active': ''}`}
          onClick={this.like}
        />
        <span className="like-count">{this.state.likes}</span>
        <button
          className={`unlike-button ${this.state.relUnlike? 'active': ''}`}
          onClick={this.unlike}
        />
        <div className="tag-list">
          {this.state.tags.map(tag => <Tag
             key={tag.href}
             backend={this.props.backend}
             url={tag.href}
             embed={tag.embed}
          />)}
        </div>
      </div>
    );
  }

}
