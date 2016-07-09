import Breadcrumbs from "react-breadcrumbs";
import {Link, IndexLink} from "react-router";
import HoC from "../hoc";

function Header({data, routes, params}) {
  const {unReadCount} = data;
  return (
    <div>
      <div className="title-bar" data-responsive-toggle="main-menu" data-hide-for="medium">
        <button className="menu-icon" type="button" data-toggle></button>
        <div className="title-bar-title">Menu</div>
      </div>
      <nav className="top-bar" data-topbar role="navigation" id="main-menu">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu>
            <li className="menu-text"><IndexLink to="/">GyreJS Debugger</IndexLink></li>
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="menu vertical medium-horizontal" data-responsive-menu="drilldown medium-dropdown">
            <li><Link to="/log">Log {unReadCount ? (<span className="success badge">+{unReadCount}</span>) : false}</Link></li>
            <li><Link to="/docs">Docs</Link></li>
            <li><a href="https://github.com/WRidder/GyreJS" target="_blank" title="Visit GyreJS on GitHub!">Github <i className="fi-social-github"></i></a></li>
          </ul>
        </div>
      </nav>
      <nav aria-label="You are here:" role="navigation">
        <Breadcrumbs
          wrapperElement="ul"
          itemElement="li"
          setDocumentTitle={false}
          separator=""
          routes={routes}
          params={params}
        />
      </nav>
    </div>
  );
}
Header.propTypes = {
  routes: React.PropTypes.any,
  params: React.PropTypes.any,
  data: React.PropTypes.any
};

export default HoC("local", "log",
  HoC("local", "router", Header)
);
