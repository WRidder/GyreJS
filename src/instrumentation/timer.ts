export default (() => {
  const start = new Date().valueOf();

  return {
    now: () => new Date().valueOf() - start,
  };
})();
