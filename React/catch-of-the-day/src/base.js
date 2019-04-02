import Rebase from 're-base';
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyBy2vzakgK3NHKWdcnXIhCqWLkzKTI21M8",
        authDomain: "catch-of-the-day-jg-a11eb.firebaseapp.com",
        databaseURL: "https://catch-of-the-day-jg-a11eb.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;