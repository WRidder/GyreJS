export const methodWrapper = (gyreId, api, mEvents) => {
  const originalAPI = api;
  let callCounter = 0;
  return Object.keys(originalAPI).reduce((methods, apiMethod) => {
    methods[apiMethod] = (...args) => {
      let result;
      try {
        if (mEvents[apiMethod] && mEvents[apiMethod].before) {
          mEvents[apiMethod].before(gyreId, callCounter, args);
        }
        // console.log("invoked apimethod", gyreId, apiMethod);
        result = originalAPI[apiMethod](...args);

        if (mEvents[apiMethod] && mEvents[apiMethod].ok) {
          mEvents[apiMethod].ok(gyreId, callCounter, args);
        }
      }
      catch (e) {
        if (mEvents[apiMethod] && mEvents[apiMethod].fail) {
          mEvents[apiMethod].fail(gyreId, callCounter, args, `${e.name}: ${e.message}`, e);
          console.error(`${e.name}: ${e.message}`); // eslint-disable-line no-console
        }
        else {
          throw e;
        }
      }
      callCounter++;
      return result;
    };
    return methods;
  }, {});
};

const now = () => {
  if (performance) {
    return performance.now();
  }
  return (new Date()).getTime();
};

export const timer = {
  start() {
    const start = now();
    return {
      stop() {
        return Math.round((now() - start) * 100) / 100;
      }
    };
  }
};
