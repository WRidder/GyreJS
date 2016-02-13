import React from "react";
import {toJSON} from "mobservable";
import {observer} from "mobservable-react";

export default (listenerId, Component) => {
  return React.createClass({
    displayName: "GyreJS-DebuggerGui-HoC",
    contextTypes: {
      gyre: React.PropTypes.object
    },
    componentWillMount() {
      this.unRegisterListener = this.context.gyre.addListener(listenerId, this.handleNewData);
    },
    componentWillUnmount() {
      this.unRegisterListener();
      if (this.ObservableComponent) {
        this.ObservableComponent();
      }
    },
    shouldComponentUpdate(oldData, newData) {
      return oldData !== newData;
    },
    handleNewData(data) {
      this.setState(data);
    },
    render() {
      if (this.ObservableComponent) {
        this.ObservableComponent();
      }

      // Render wrapped component with current props and state as props.
      const ObservableComponent = this.ObservableComponent =
        observer( (data) => {
          return (<Component {...toJSON(data, false).data}/>);
        });

      return (<ObservableComponent data={this.state}/>);
    }
  });
};
