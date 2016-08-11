import {Router, Route, IndexRoute, createMemoryHistory} from "react-router";
import React from "react";
import Main from "./main/main";
import CardListing from "./gyre/card-listing";
import Docs from "./docs";
import EventLog from "./log";

// Gyre
import GyreContainer from "./gyre/container";
import GyreSummary from "./gyre/summary";

export default (GyreDebugger, LocalGyre, windowObjectReference) => {
  const history = createMemoryHistory("/");
  history.listen(({pathname}) => {
    LocalGyre.trigger("routerDidChange", pathname);
  });

  return (
    <Router history={history}>
      <Route path="/" name="Home" component={Main(GyreDebugger, LocalGyre, windowObjectReference)}>
        <IndexRoute component={CardListing} />
        <Route path="log" name="Log" component={EventLog} />
        <Route path="docs" name="GyreJS Docs" component={Docs} />
        <Route path="gyre/:id" name="Gyre" component={GyreContainer}>
          <IndexRoute component={GyreSummary} />
          <Route path="/summary" name="Summary" component={GyreSummary} />
        </Route>
      </Route>
    </Router>
  );
};
