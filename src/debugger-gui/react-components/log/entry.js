import JSONTree from "react-json-tree";
import TimeAgo from "react-timeago";
import {GyreLink} from "../common/link-gyre";

export const Entry = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      gId: React.PropTypes.string,
      payload: React.PropTypes.object,
      msg: React.PropTypes.string.isRequired,
      time: React.PropTypes.number.isRequired
    })
  },
  shouldComponentUpdate: () => false,
  render: function() {
    const {gId, payload, time, msg} = this.props.data;
    return (<div className="event-flash">[<GyreLink id={gId}/>] <TimeAgo date={time} minPeriod={0}/>, {msg} {payload === void(0) ? false : (<JSONTree data={payload} />)}</div>);
  }
});
