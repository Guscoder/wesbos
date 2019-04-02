import React from 'react'; // gets dependenices from json file
import { render } from 'react-dom';  // will render the page out to the DOM
import Router from "./components/Router";
import "./css/style.css";

render(<Router />, document.querySelector("#main"));

