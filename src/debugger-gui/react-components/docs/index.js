export default React.createClass({
  shouldComponentUpdate: () => false,
  render: () => (<iframe className="iframe-docs" seamless="seamless" frameBorder="0" src="http://gyre.js.org" />)
});
