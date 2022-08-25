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
        <button className="from-computer">From computer</button>
        <button className="from-web" onClick={() => {this.setSource(true);}}>
          From web
        </button>
        <form>
          <input type="file" className="file-input" />
          <input type="url" className="url-input" />
        </form>
      </div>
  }

}
