import {Entry} from "./entry";

export const List = React.createClass({
  propTypes: {
    data: React.PropTypes.shape({
      log: React.PropTypes.array.isRequired
    })
  },
  contextTypes: {
    "gyre-local": React.PropTypes.object.isRequired
  },
  componentDidMount() {
    this.context["gyre-local"].trigger("logViewed");
  },
  componentDidUpdate() {
    this.context["gyre-local"].trigger("logViewed");
  },
  render: function() {
    const self = this;
    const {log} = this.props.data;
    const logs = log.slice(Math.max(log.length - 25, 0));
    logs.reverse();

    return (
      <div className="route-view">
        <div className="callout">
          {logs.map(function(entry) {
            return <Entry key={entry.time} data={entry}/>;
          })}
        </div>
      </div>
    );
  }
});
