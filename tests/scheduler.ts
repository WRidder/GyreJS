import {SomeFunction} from "../src/scheduler";

it("should render without error", () =>
  expect(true).toBe(true));

it("the SomeFunction should return the same value", () =>
  expect(SomeFunction(false)).toBe(false));

