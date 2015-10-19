(function(React, ReactDOM, GyreJS) {
  var smartRestGyre = GyreJS.createGyre("smartRest");
  var ReactHoC = smartRestGyre.reactHoC;

  // Add middleware
  smartRestGyre.use(GyreJS.middleWare.dispatchLogger);
  smartRestGyre.use(GyreJS.middleWare.injectDispatch);

  // Create view
  var View = React.createClass({
    render: function() {
      console.log("View!", this.props.data);
      return (
        <span>Hi now!</span>
      );
    }
  });

  const ErrorView = React.createClass({
    displayName: "ErrorView",
    render: function() {
      return (
        <div>
          <h3>{"Error: view data failed to load"}</h3>
        </div>
      );
    }
  });

  const LoadingView = React.createClass({
    displayName: "LoadingView",
    render: function() {
      return (
        <div>
          <h3>{"Loading:... "}</h3>
        </div>
      );
    }
  });

  /**
   * Get post by Id
   * URL: /posts/2?fields=["id","title"]?paging=[...]
   */
   const HoCView = ReactHoC({
    "posts": {
      "id": 2,
      "fields": [
        "content",
        "title"
      ]
    }
  }, View, LoadingView, ErrorView);

  ReactDOM.render(
    <HoCView/>,
    document.getElementById("main")
  );
})(React, ReactDOM, GyreJS);
