import * as types from "./common/types";
import {LabelledValue} from "./common/types";

function greeter(labelledObj: LabelledValue, somevar: boolean = true) {
  return "Hello, " +labelledObj.label;
}

function greeter2(labelledObj: types.LabelledValue, somevar: boolean = true) {
  return "Hello, " +labelledObj.label;
}

let someVal = {
  label: "hi there!"
};
const krunal = greeter(someVal);
const krunal2 = greeter2(someVal, false);
console.log(krunal);

