import {PropTypes} from "react";

export const Tabs = React.createClass({
  propTypes: {
    children: PropTypes.object
  },
  contextTypes: {
    "popup-window": React.PropTypes.object
  },
  invokeFoundation(el) {
    this.context["popup-window"].$(el).foundation();
  },
  render() {
    return (
      <div ref={this.invokeFoundation}>
        <ul className="tabs" id="example-vert-tabs" data-tabs>
          <li className="tabs-title is-active"><a href="#panel1v" aria-selected="true">Summary</a></li>
          <li className="tabs-title"><a href="#panel2v">Log</a></li>
          <li className="tabs-title"><a href="#panel3v">Aggregates</a></li>
          <li className="tabs-title"><a href="#panel4v">Projections</a></li>
          <li className="tabs-title"><a href="#panel3v">Traces</a></li>
          <li className="tabs-title"><a href="#panel-traces">Traces</a></li>
          <li className="tabs-title"><a href="#panel-alerts">Alerts <span className="warning badge">12</span></a></li>
        </ul>
        <div className="tabs-content" data-tabs-content="example-vert-tabs">
          <div className="tabs-panel is-active" id="panel1v">
            <p>2Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
          <div className="tabs-panel" id="panel2v">
            <p>Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
              porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
              Suspendisse dictum feugiat nisl ut dapibus.
            </p>
          </div>
          <div className="tabs-panel" id="panel3v">
            {this.props.children}
          </div>
          <div className="tabs-panel" id="panel4v">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className="tabs-panel" id="panel5v">
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </p>
          </div>
        </div>
      </div>
    );
  }
});
