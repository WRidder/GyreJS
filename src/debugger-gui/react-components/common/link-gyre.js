import {Link} from "react-router";
export const GyreLink = (props) => (
  <Link to={`/gyre/${props.id}`}>{props.id}</Link>
);
