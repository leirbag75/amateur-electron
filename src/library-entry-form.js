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
    return <div>
        <button className="from-computer" onClick={() => {this.setSource(false);}}>
          From computer
        </button>
        <button className="from-web" onClick={() => {this.setSource(true);}}>
          From web
        </button>
        <form>
          {
            this.state.fromWeb?
              <input type="url" className="url-input" />:
              <input type="file" className="file-input" />
          }
        </form>
      </div>
  }

}
