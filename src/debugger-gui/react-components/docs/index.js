export default class Docs extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (<iframe className="iframe-docs" seamless="seamless" frameBorder="0" src="http://gyre.js.org" />);
  }
}
