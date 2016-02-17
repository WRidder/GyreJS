import HoC from "../hoc";
import {GyreLink} from "../common/link-gyre";

export default HoC("debugger", "gyreList", (props) => {
  const {gyreList, nrTriggered} = props.data;
  return (
    <div className="route-view">
      <div className="row expanded">
        {gyreList.map((gyre) => (
          <div className="column small-4 medium-3 large-2" key={gyre.gId}>
            <div className="callout success">
              <h5><GyreLink id={gyre.gId}/></h5>
              <div className="callout">
                <strong>Details</strong>
                <li>25 commands</li>
                <li>30 events</li>
                <li>5 aggregates</li>
                <li>7 projections</li>
              </div>
              <div className="callout">
                <strong>Ops</strong>
                <li>25 commands issued</li>
                <li>{nrTriggered} events triggered</li>
                <li>7 listeners active</li>
              </div>
              <span className="alert label">5 errors</span>&nbsp;
              <span className="warning label">1 warning</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

