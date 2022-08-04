import React from 'react';
import Thumbnail from './thumbnail';

export default class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      thumbnails: []
    }
  }

  setThumbnails(thumbnails) {
    this.setState({thumbnails});
  }

  render() {
    return <div className="thumbnails">
        {
          this.state.thumbnails.map(thumbnail =>
            <Thumbnail
             key={thumbnail.href}
             url={thumbnail.href}
             backend={this.props.backend}
             embed={thumbnail.embed}
            />
          )
        }
      </div>
  }

}
