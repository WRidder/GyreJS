import Entry from "./entry";

class List extends React.Component {
  componentDidMount() {
    this.context["gyre-local"].trigger("logViewed");
  }
  componentDidUpdate() {
    this.context["gyre-local"].trigger("logViewed");
  }
  render() {
    const {log} = this.props.data;
    const logs = log.slice(Math.max(log.length - 25, 0));
    logs.reverse();

    const Contents = logs.length === 0 ?
      (<span>Nothing to see here...</span>) :
      (<div className="callout">
        {logs.map((entry) => <Entry key={entry.time} data={entry} />)}
      </div>);

    return (
      <div className="route-view">
        {Contents}
      </div>
    );
  }
}

List.propTypes = {
  data: React.PropTypes.shape({
    log: React.PropTypes.array.isRequired
  })
};

List.contextTypes = {
  "gyre-local": React.PropTypes.object.isRequired
};

export default List;
