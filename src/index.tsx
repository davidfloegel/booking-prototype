import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Offers from "./Offers";
import Selection from "./Selection";
import Finalise from "./Finalise";
import * as serviceWorker from "./serviceWorker";

const Main: React.SFC<any> = () => (
  <Router>
    <Route exact path="/" component={Offers} />
    <Route exact path="/selection/:option" component={Selection} />
    <Route exact path="/finalise" component={Finalise} />
  </Router>
);

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
