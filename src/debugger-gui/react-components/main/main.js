import Header from "./header";

export default (GyreDebugger, LocalGyre, windowObjectReference) => {
  class Main extends React.Component {
    getChildContext() {
      return {
        "gyre-debugger": GyreDebugger._debugGyre,
        "gyre-local": LocalGyre,
        "popup-window": windowObjectReference
      };
    }
    render() {
      return (
        <div className="container">
          <Header routes={this.props.routes} params={this.props.params} />
          {this.props.children}
        </div>
      );
    }
  }

  Main.childContextTypes = {
    "gyre-debugger": React.PropTypes.object,
    "gyre-local": React.PropTypes.object,
    "popup-window": React.PropTypes.object
  };
  Main.propTypes = {
    params: React.PropTypes.any,
    children: React.PropTypes.any,
    routes: React.PropTypes.any
  };

  return Main;
};
