/**
 * Higher order Component factory for local gyre.
 *
 * @param {Function} reducer Reducer factory.
 * @returns {Function} HoC Factory.
 */
const localHoCFactory = (reducer) => {
  /**
   * localHoC()
   *
   * @param {String} matcher Matcher.
   * @param {Object} DefaultComponent Default component.
   * @param {*} initialData Initial state.
   * @returns {Object} React class
   */
  return (matcher, DefaultComponent) => {
    return React.createClass({
      displayName: "GyreJS-localHoC",
      getInitialState() {
        return {
          data: null
        };
      },
      componentWillMount() {
        this.unRegisterReducer = reducer(matcher, this.handleNewData);
      },
      shouldComponentUpdate(nextState) {
        return this.state.data !== nextState.data;
      },
      componentWillUnmount() {
        this.unRegisterReducer();
      },
      handleNewData(data) {
        this.setState({
          data
        });
      },
      render() {
        return typeof this.state.data !== "undefined"
          ? <DefaultComponent {...this.props} {...this.state}/>
          : false;
      }
    });
  };
};

export default localHoCFactory;
