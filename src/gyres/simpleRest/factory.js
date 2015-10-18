import GyreFactory from "../../gyreFactory";
import Reducer from "./reducer";
import ReactHoC from "./reactHoC";
import defaultActions from "./actions";
export default GyreFactory("simpleRest", Reducer, ReactHoC, defaultActions);
