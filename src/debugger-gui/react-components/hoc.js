export default (gyre, listenerId, Component) => {
  class HoC extends React.Component {
    constructor(props) {
      super(props);
      this.handleNewData = this.handleNewData.bind(this);
    }
    componentWillMount() {
      this.unRegisterListener = this.context[`gyre-${gyre}`].addListener(listenerId, this.handleNewData);
    }
    componentWillUnmount() {
      this.unRegisterListener();
    }
    handleNewData(data) {
      this.setState({
        data
      });
    }
    render() {
      return this.state ? (<Component {...this.props} data={Object.assign(this.props.data || {}, this.state.data)} />) : false;
    }
  }

  HoC.displayName = "GyreJS-DebuggerGui-HoC";
  HoC.contextTypes = {
    "gyre-debugger": React.PropTypes.object,
    "gyre-local": React.PropTypes.object
  };
  HoC.propTypes = {
    data: React.PropTypes.any
  };

  return HoC;
};
