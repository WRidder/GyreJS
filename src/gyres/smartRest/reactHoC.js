import Immutable from "immutable";

/**
 * Higher order Component factory for local gyre.
 *
 * @param {Function} reducer Reducer factory.
 * @returns {Function} HoC Factory.
 */
const reactHoCFactory = (reducer) => {
  /**
   * reactHoC()
   *
   * @param {String} matcher Matcher.
   * @param {Object} DefaultComponent Default component.
   * @param {Object} LoadingComponent Loading component.
   * @param {Object} ErrorComponent Error component.
   * @returns {Object} React class
   */
  return (matcher, DefaultComponent, LoadingComponent, ErrorComponent) => {
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
      shouldComponentUpdate(nextProps, nextState) {
        if (this.state.status !== nextState.status) {
          return true;
        }

        if (nextState.data) {
          return !Immutable.is(nextState.data, this.state.data);
        }
        return true;
      },
      componentWillUnmount() {
        this.unRegisterReducer();
      },
      handleNewData(status, data) {
        this.setState({
          data,
          status
        });
      },
      render() {
        // Render wrapped component with current props and state as props.
        if (!this.state || !this.state.status) {
          return false;
        }


        let Component;
        switch (this.state.status) {
          case "LOADING": {
            Component = LoadingComponent;
            break;
          }
          case "ERROR": {
            Component = ErrorComponent;
            break;
          }
          default: {
            Component = DefaultComponent;
          }
        }
        return Component ? <Component {...this.props} {...this.state}/> : false;
      }
    });
  };
};

export default reactHoCFactory;
