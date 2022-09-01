import React from 'react';

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

  render() {
    return <div className="library-entry-modal">
        <div className="source-selection">
          <button className="from-computer" onClick={() => {this.setSource(false);}}>
            From computer
          </button>
          <button className="from-web" onClick={() => {this.setSource(true);}}>
            From web
          </button>
        </div>
        <form>
          {
            this.state.fromWeb?
              <>
                <label htmlFor="url-input">URL</label>
                <input type="url" id="url-input" />
              </>:
              <>
                <label htmlFor="file-input">file</label>
                <input type="file" id="file-input" />
              </>
          }
          <input className="submit-library-entry" type="submit" />
        </form>
      </div>
  }

}
