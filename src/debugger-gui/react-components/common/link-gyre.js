import {Link} from "react-router";

export default function GyreLink(props) {
  return (
    <Link to={`/gyre/${props.id}`}>{props.id}</Link>
  );
}
GyreLink.propTypes = {
  id: React.PropTypes.string.isRequired
};
