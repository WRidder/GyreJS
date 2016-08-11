import JSONTree from "react-json-tree";
import TimeAgo from "react-timeago";
import GyreLink from "../common/link-gyre";

class Entry extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {gId, payload, time, msg} = this.props.data;
    return (<div className="event-flash">[<GyreLink id={gId} />] <TimeAgo date={time} minPeriod={0} />, {msg} {payload === void(0) ? false : (<JSONTree data={payload} />)}</div>);
  }
}

Entry.propTypes = {
  data: React.PropTypes.shape({
    gId: React.PropTypes.string,
    payload: React.PropTypes.any,
    msg: React.PropTypes.string.isRequired,
    time: React.PropTypes.number.isRequired
  })
};

export default Entry;
