import React from 'react';
import Resource from './resource';
import Tag from './tag';
import * as Reader from './readers';
import Button from './button';
import { OperationNotEnabled } from './errors';

let readers = [
  new Reader.LinkReader('like', 'enableLiking'),
  new Reader.LinkReader('unlike', 'enableUnliking'),
  new Reader.FieldReader('src', 'setSrc'),
  new Reader.LinkListReader('tag-entry', 'setTags'),
  new Reader.FieldReader('likes', 'setLikes'),
  new Reader.LinkReader('add-tag', 'enableAddingTags')
];

export default class ImageViewer extends Resource {

  constructor(props) {
    super(props);
    this.state = {
      relLike: null,
      relUnlike: null,
      relAddTag: null,
      src: '',
      tags: [],
      likes: 0
    };
  }

  readers() {
    return readers;
  }

  // In like and unlike below, we have to return the promise to allow these
  // functions to be awaited in tests

  like = () => {
    if(!this.state.relLike)
      throw new OperationNotEnabled('Liking not enabled');
    return this.props.backend.like(this.state.relLike, this).then(() => {
      this.refresh();
    });
  }

  unlike = () => {
    if(!this.state.relUnlike)
      throw new OperationNotEnabled('Unliking not enabled');
    return this.props.backend.unlike(this.state.relUnlike, this).then(() => {
      this.refresh();
    });
  }

  addTag(tagName) {
    if(!this.state.relAddTag)
      throw new OperationNotEnabled('Adding tags not enabled');
    return this.props.backend.addTag(this.state.relAddTag, tagName)
      .then(() => this.refresh());
  }

  onSubmitTagName = event => {
    event.preventDefault();
    this.addTag(event.target.elements.tagName.value);
  }

  enableAddingTags(url) {
    this.setState({relAddTag: url});
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
        <div className="like-controls">
          <Button
            className={`like-button ${this.state.relLike? 'active': ''}`}
            onClick={this.like}
          >
            thumb_up
          </Button>
          <span className="like-count">{this.state.likes}</span>
          <Button
            className={`unlike-button ${this.state.relUnlike? 'active': ''}`}
            onClick={this.unlike}
          >
            thumb_down
          </Button>
        </div>
        <form className="add-tag" onSubmit={this.onSubmitTagName}>
          <input className="tag-name" name="tagName" />
          <button className="submit-tag-name" type="submit">Add tag</button>
        </form>
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
