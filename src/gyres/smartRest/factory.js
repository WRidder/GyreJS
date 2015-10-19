import GyreFactory from "../../gyreFactory";
import Reducer from "./reducer";
import ReactHoC from "./reactHoC";
import defaultActions from "./actions";
import state from "./state";
export default GyreFactory(Reducer, ReactHoC, defaultActions, state);
