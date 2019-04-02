import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

 static propTypes = {
   match: PropTypes.object
 }
  componentDidMount(){
    const { params } = this.props.match;
     // first reinstate local storage
    const localStorageRef = localStorage.getItem(params.storeId);
    if(localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef)})
    }
    this.ref = base.syncState(`${params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }

  componentDidUpdate() {
    localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = fish => {
    // 1. Take a copy of the existing state
    const fishes = { ...this.state.fishes } //spread operator brings in entire existing array
    // 2. Add our new fish to the existing state array of fishes
    fishes[`fish${Date.now()}`] = fish; // Using Date.now to give fish a unique id
    // 3. Set the new fishes object to be the new state
    this.setState({
      fishes: fishes
    });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  updateFish = (key, updatedFish) => {
    // 1. take a copy of the current state
    const fishes = { ...this.state.fishes };
    // 2. Update that state
    fishes[key] = updatedFish;
    // 3. Set that to state
    this.setState({fishes});
  };

  deleteFish = (key) => {
    // 1. take a copy of state
    const fishes = { ...this.state.fishes };
    // 2. update the state
    fishes[key] = null; //use null because firebase reqauires it to delete the fish
    // 3. update state
    this.setState({ fishes });
  };
  addToOrder = (key) => {
    // 1. take a copy of state
    const order = { ...this.state.order };
    // 2. Either add to the order, or update the number in our order
    order[key] = order[key] + 1 || 1; 
    // 3. Call setState to update our state object
    this.setState({order});
  };

  removeFromOrder = key => {
    // 1. take a copy of state
    const order = { ...this.state.order };
    // 2. Remove item from order
    delete order[key];
    // 3. Call setState to update our state object
    this.setState({order});
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" age={100} />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish 
                key={key} 
                index={key} 
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order 
          fishes={this.state.fishes} 
          order={this.state.order}  
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory 
          addFish={this.addFish} 
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId}
          />
      </div>
    );
  }
}

export default App;