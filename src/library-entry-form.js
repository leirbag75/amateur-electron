import React from 'react';

export default class LibraryEntryForm extends React.Component {

  render() {
    return <div>
        <button className="from-computer">From computer</button>
        <button className="from-web">From web</button>
        <form>
          <input type="file" className="file-input" />
          <input type="url" className="url-input" />
        </form>
      </div>
  }

}
