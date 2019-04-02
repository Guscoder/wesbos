import React from 'react'; // gets dependencies from json file
import PropTypes from "prop-types";

import  { getFunName } from "../helpers";

class StorePicker extends React.Component { // creates class for component
  myInput = React.createRef();
  static propTypes = {
    history: PropTypes.object
  };
  gotToStore = (event) => {
    // 1. Stop the form from submitting
    event.preventDefault();
    // 2. get the text from that from input
    const storeName = this.myInput.value.value; // first value is React, then second value is JS
    // 3. Change the page to /store/whatever they entered
    this.props.history.push(`/store/${storeName}`);
  }
  render() {
    return ( // Cannot return sibling elements in jsx!!! Must use React.Fragment
      <form className="store-selector" onSubmit={this.gotToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref={this.myInput} required placeholder="Store Name" defaultValue={getFunName()} />
        <button type="submit">Visit Store </button>
      </form>
    );  
  }
}

export default StorePicker; // need to export component to make available to other parts of app