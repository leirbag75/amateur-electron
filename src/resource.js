import React from 'react';

export default class Resource extends React.Component {

  readers() {
    return [];
  }

  readResource = resource => {
    for(let reader of this.readers())
      reader.read(resource, this);
  }

  componentDidMount() {
    if(this.props.embed) {
      this.readResource(this.props.embed);
    }
    if(this.props.url)
      this.refresh();
  }

  componentDidUpdate(previousProps) {
    if(this.props.url && this.props.url !== previousProps.url)
      this.refresh();
    if(this.props.embed && this.props.embed !== previousProps.embed)
      this.readResource(this.props.embed);
  }

  refresh() {
    this.props.backend.loadResource(this.props.url).then(this.readResource);
  }

  render() {
  }

}
