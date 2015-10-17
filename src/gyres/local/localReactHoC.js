/**
 * Higher order Component factory for local gyre.
 *
 * @param {Object} React Current react instance
 * @param {Function} reducer Reducer factory
 * @returns {Function} HoC Factory
 */
const localHoCFactory = (React, reducer) => {
  /**
   * localHoC()
   *
   * @param {String} matcher Matcher
   * @param {Object} DefaultComponent Default component
   * @param {*} initialData Initial state
   * @returns {Object} React class
   */
  return (matcher, DefaultComponent, initialData) => {
    return React.createClass({
      displayName: "GyreJS-localHoC",
      getInitialState() {
        return initialData || null;
      },
      componentWillMount() {
        this.unRegisterReducer = reducer(matcher, this.handleNewData);
      },
      componentWillUnmount() {
        this.unRegisterReducer();
      },
      shouldComponentUpdate(nextState) {
        return this.state !== nextState;
      },
      handleNewData(data) {
        this.setState({
          data
        });
      },
      render() {
        return this.state ? <DefaultComponent {...this.props} {...this.state}/> : false;
      }
    });
  };
};

export default localHoCFactory;
