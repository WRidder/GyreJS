import Header from "./header";

export default (GyreDebugger, LocalGyre) => React.createClass({
  childContextTypes: {
    "gyre-debugger": React.PropTypes.object,
    "gyre-local": React.PropTypes.object
  },
  getChildContext: function() {
    return {
      "gyre-debugger": GyreDebugger._debugGyre,
      "gyre-local": LocalGyre
    };
  },
  render: function() {
    return (
      <div className="container">
        <Header routes={this.props.routes} params={this.props.params}/>
        {this.props.children}
      </div>
    );
  }
});
