const tickers = {
  synchronous: (cb) => cb(),
  deferred: (cb) => setTimeout(() => cb(), 0)
};

export default {
  get: (ticker) => {
    return tickers[ticker] || tickers.synchronous;
  }
};
