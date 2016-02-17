export default (gyre, listenerId, Component) => {
  return React.createClass({
    displayName: "GyreJS-DebuggerGui-HoC",
    contextTypes: {
      "gyre-debugger": React.PropTypes.object,
      "gyre-local": React.PropTypes.object
    },
    componentWillMount() {
      this.unRegisterListener = this.context["gyre-" + gyre].addListener(listenerId, this.handleNewData);
    },
    componentWillUnmount() {
      this.unRegisterListener();
    },
    handleNewData(data) {
      this.setState({
        data
      });
    },
    render() {
      return this.state ? (<Component {...this.props} data={Object.assign(this.props.data || {}, this.state.data)}/>) : false;
    }
  });
};
