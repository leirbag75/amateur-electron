import React from 'react';

function webSource(event) {
  return event.target.elements.urlInput.value;
}

function fileSource(event) {
  return 'file://' + event.target.elements.fileInput.files[0].path;
}

export default class LibraryEntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fromWeb: false
    };
  }

  setSource(value) {
    this.setState({fromWeb: !!value});
  }

  hiddenClass() {
    return this.props.visible? '' : 'hidden';
  }

  onSubmit = event => {
    event.preventDefault();
    if(this.state.fromWeb)
      this.props.onSubmit(webSource(event));
    else
      this.props.onSubmit(fileSource(event));
  }

  render() {
    return <div className={`library-entry-modal ${this.hiddenClass()}`}>
        <div className="source-selection">
          <button className="from-computer" onClick={() => {this.setSource(false);}}>
            From computer
          </button>
          <button className="from-web" onClick={() => {this.setSource(true);}}>
            From web
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          {
            this.state.fromWeb?
              <div>
                <label htmlFor="url-input">URL</label>
                <input type="url" id="url-input" name="urlInput" />
              </div>:
              <div>
                <label htmlFor="file-input">file</label>
                <input type="file" id="file-input" name="fileInput" />
              </div>
          }
          <input className="submit-library-entry" type="submit" />
        </form>
      </div>
  }

}
