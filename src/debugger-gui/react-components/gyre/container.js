export default React.createClass({
  render: function() {
    return (
      <div className="route-view">Gyre main! {this.props.children}</div>
    );
  }
});
