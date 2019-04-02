import React from "react";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm"
import PropTypes from "prop-types";
import Login from "./login";
import firebase from "firebase";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  }

  state = {
    uid: null,
    owner: null
  };

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.authHandler({ user });
      }
    })
  }

  authHandler = async authData => {
    // 1. Look up the current store in the firebase database
    const store = await base.fetch(this.props.storeId, { context: this });
    console.log(store.owner);
    // 2. Claim the store if there is no owner
    if (!store.owner){
      // save it as our own store
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      });
    }
    // 3. Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.id
    })
  };

  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  logout = async () => {
    console.log("Logging Out");
    await firebase.auth().signOut();
    this.setState({uid: null});
  };
  
  render() {
    const logout = <button onClick={this.logout}>Log Out</button>  
    // Check if they are logged in
    if (!this.state.uid){
      return <Login authenticate={this.authenticate} />;
    }
    // Check if they are not the owner of the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you are not the owner!</p>
          {logout}
        </div>
      );
    }
    // They must be the owner, just render the inventory
    return (<div className="inventory">
              <h2>Inventory</h2>
              {logout}
              {Object.keys(this.props.fishes).map(key => (
                <EditFishForm 
                  key={key} 
                  index={key} // passing down actual key to use when updating fish in state
                  fish={this.props.fishes[key]}
                  updateFish={this.props.updateFish} 
                  deleteFish={this.props.deleteFish}
                />
              ))}
              <AddFishForm addFish={this.props.addFish}/>
              <button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
            </div>);
  }
}

export default Inventory;