var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  QueryCache: () => QueryCache,
  QueryClient: () => QueryClient,
  QueryObserver: () => QueryObserver
});

// src/EventEmitter.ts
var EventEmitter = class extends Function {
  constructor() {
    super(...arguments);
    this.events = /* @__PURE__ */ new Map();
  }
  on(event, fn) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event).splice(this.events.get(event).indexOf(fn), 1);
  }
  emit(event, ...data) {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event).forEach((fn) => fn(...data));
  }
};

// src/Query.ts
var Query = class extends EventEmitter {
  constructor({
    initialData,
    initialDataUpdatedAt = Date.now(),
    queryFn,
    queryKey,
    queryType = "query"
  }) {
    super();
    this.active = true;
    this.destroyed = false;
    this.cacheTime = 5 * 60 * 1e3;
    this.staleTime = 0;
    this.cacheTimeoutKey = null;
    this.currentQuery = null;
    this.queryState = {
      data: null,
      dataUpdatedAt: null,
      error: null,
      errorUpdatedAt: null,
      failureCount: 0,
      status: "loading",
      isPaused: false,
      isFetching: false,
      isInvalidated: false
    };
    this.queryKey = this.hashQueryKey(queryKey);
    this.queryFn = queryFn;
    this.queryType = queryType;
    if (typeof initialData === "undefined") {
      return;
    }
    this.queryState.data = initialData;
    this.queryState.dataUpdatedAt = new Date(initialDataUpdatedAt).valueOf();
  }
  static from(obj, options) {
    return new Query(options);
  }
  hashQueryKey(key) {
    if (Array.isArray(key)) {
      key = [key];
    }
    const serialize = (key2) => {
      if (Array.isArray(key2)) {
        return key2.map(serialize).join(",");
      }
      if (typeof key2 === "object" && key2 !== null) {
        return Object.entries(key2).filter(([k, v]) => typeof v !== "undefined").sort(([k1], [k2]) => k1.localeCompare(k2)).map(([k, v]) => `${k}=${serialize(v)}`).join("&");
      }
      return typeof key2 === "string" ? `"${key2}"` : `${key2}`;
    };
    return serialize(key);
  }
  getQueryContext({ variables }) {
    const controller = new AbortController();
    return {
      variables,
      queryKey: this.queryKey,
      signal: controller.signal
    };
  }
  isStale(staleTime = 0) {
    if (this.queryState.data === null) {
      return true;
    }
    const { dataUpdatedAt, errorUpdatedAt } = this.queryState;
    const isDataStale = dataUpdatedAt + staleTime < Date.now();
    const isErrorStale = errorUpdatedAt + staleTime < Date.now();
    return isDataStale || isErrorStale;
  }
  getQuery(context) {
    if (!this.isStale(context.staleTime)) {
      return this.queryState.data;
    }
    if (!this.currentQuery) {
      const currentQuery = this.queryFn(context);
      if (currentQuery instanceof Promise) {
        this.currentQuery = currentQuery.finally(() => {
          this.currentQuery = null;
        });
      }
    }
    return this.currentQuery;
  }
  setState(newState) {
    Object.assign(this.queryState, newState);
    this.emit("update", this.state());
  }
  setCacheTimer() {
    clearTimeout(this.cacheTimeoutKey);
    this.cacheTimeoutKey = setTimeout(() => {
      this.destroy();
    }, this.cacheTime);
  }
  async fetch({ variables } = {}) {
    this.setState({ isFetching: true });
    let data = null;
    let error = null;
    try {
      const context = this.getQueryContext({ variables });
      data = await this.getQuery(context);
      this.setState({
        data,
        status: "success",
        failureCount: 0,
        dataUpdatedAt: Date.now()
      });
      this.emit("success", data, this);
    } catch (err) {
      error = err;
      this.setState({
        error,
        errorUpdatedAt: Date.now(),
        failureCount: this.queryState.failureCount + 1,
        status: "error"
      });
      this.emit("error", err, this);
    }
    this.setState({ isFetching: false, isFetched: true, isLoading: false });
    this.emit("settled", data, error, this);
    this.setCacheTimer();
  }
  setData(dataOrUpdater) {
    let data = dataOrUpdater;
    if (typeof dataOrUpdater === "function") {
      data = dataOrUpdater(this.queryState.data);
    }
    this.setState({ data });
  }
  invalidate(options) {
  }
  state() {
    return { ...this.queryState };
  }
  matches(filters) {
    if (typeof filters === "string") {
      filters = { queryKey: filters };
    }
    const { queryKey, exact, predicate } = filters;
    const hashedKey = this.hashQueryKey(queryKey);
    if (queryKey && (exact && this.queryKey !== hashedKey) || !this.queryKey.startsWith(hashedKey)) {
      return false;
    }
    if (typeof predicate === "function" && !predicate(this)) {
      return false;
    }
    return true;
  }
  destroy() {
    this.destroyed = true;
    clearTimeout(this.cacheTimeoutKey);
  }
};

// src/QueryCache.ts
var QueryCache = class {
  constructor({ onError, onSuccess }) {
    this.queries = [];
    this.onError = null;
    this.onSuccess = null;
    this.onError = onError;
    this.onSuccess = onSuccess;
  }
  cache(query) {
    if (this.onError) {
      query.on("error", this.onError);
    }
    if (this.onSuccess) {
      query.on("success", this.onSuccess);
    }
    this.queries.push(query);
  }
  remove(query) {
  }
  find(filters) {
    return this.findAll(filters).shift();
  }
  findAll(filters) {
    return this.queries.filter((query) => query.matches(filters));
  }
  subscribe() {
    return () => {
    };
  }
  clear() {
    this.queries.forEach((query) => query.destroy());
  }
};

// src/QueryClient.ts
var QueryClient = class extends Function {
  constructor({
    queryCache = new QueryCache({ onError: null, onSuccess: null }),
    mutationCache = new QueryCache({ onError: null, onSuccess: null }),
    defaultOptions = {}
  } = {}) {
    super();
    this.queryCache = queryCache;
    this.mutationCache = mutationCache;
    this.defaultOptions = defaultOptions;
  }
  getQuery(key) {
    return this.queryCache.find(key);
  }
  getOrCreateQuery(key, options) {
    let query = this.queryCache.find(key);
    if (!query) {
      query = new Query({ ...this.defaultOptions, ...options, queryKey: key });
      this.queryCache.cache(query);
    }
    return query;
  }
  getQueryData(key) {
    const query = this.getQuery(key);
    return query?.queryState.data;
  }
  setQueryData(key, dataOrUpdater) {
    const query = this.getOrCreateQuery(key);
    query.setData(dataOrUpdater);
  }
  getQueryState(key) {
    const query = this.getQuery(key);
    return query?.state();
  }
  fetchQuery(options) {
    const { queryKey } = options;
    const query = this.getOrCreateQuery(queryKey);
    query.fetch();
  }
  isMutating(filters) {
    return this.mutationCache.findAll({ ...filters, fetching: true }).length > 0;
  }
  isFetching(filters) {
    return this.queryCache.findAll({ ...filters, fetching: true }).length;
  }
  invalidateQueries(key, filters, invalidateOptions) {
    this.queryCache.findAll({ queryKey: key, ...filters }).forEach((query) => {
      query.invalidate(invalidateOptions);
    });
  }
  cancelQueries(keyOrFilters) {
  }
  removeQueries(keyOrFilters) {
  }
  refetchQueries(keyOrFilters) {
  }
  prefetchQuery(key, fn) {
  }
};

// src/QueryObserver.ts
var QueryObserver = class {
  constructor(queryClient, options) {
    this.listeners = [];
    this.queryClient = queryClient;
    const { queryKey } = options;
    this.query = queryClient.getOrCreateQuery(queryKey, options);
    this.query.on("update", this.onUpdate.bind(this));
  }
  onUpdate(newState) {
    this.listeners.forEach((listener) => listener(newState));
  }
  subscribe(listener) {
    this.listeners.push(listener);
    this.query.fetch();
    return () => this.unsubscribe(listener);
  }
  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  emit(query) {
    this.listeners.forEach((listener) => listener(query.state()));
  }
};
module.exports = __toCommonJS(src_exports);
