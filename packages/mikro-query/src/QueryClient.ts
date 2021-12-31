import { EventEmitter } from "./EventEmitter";

export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

type QueryFilters = {
  exact?: Boolean;
  active?: Boolean;
  inactive?: Boolean;
  stale?: Boolean;
  fetching?: Boolean;
  predicate?: (query: Query) => Boolean;
  queryKey?: string;
};

type QueryActions<TData> = {
  refetchActive?: Boolean;
  refetchInactive?: Boolean;
  refetchPage?: (page: TData, index: number, allpages: TData[]) => Boolean;
};

type InvalidateOptions = {
  throwOnError?: boolean;
  cancelRefetch?: boolean;
};

type QueryState<TData = unknown, TError = unknown> = {
  data: unknown;
  dataUpdatedAt: number;
  error: unknown;
  errorUpdatedAt: number;
  failureCount: number;
  status: QueryStatus;
  isPaused: boolean
  isFetching: boolean;
  isInvalidated: boolean;
};

type QueryFunctionContext<TData = unknown, TError = unknown> = {
  variables: Record<string, unknown>;
  queryKey: string;
  signal: AbortSignal;
};

type QueryFunction = (context: QueryFunctionContext) => Promise<any>;

type QueryListener = (queryState: QueryState) => void;

type QueryOptions<TData = unknown> = {
  queryKey: string;
  queryFn?: QueryFunction;
  queryType?: 'query' | 'mutation';
  initialData?: TData;
  initialDataUpdatedAt?: Date | number;
  cacheTime?: number;
  isDataEqual?: (oldData: TData, newData: TData) => boolean;
  retry?: number | (() => number);
  meta?: unknown,
};

type QueryFetchOptions = Record<string, any>;

class Query extends EventEmitter {
  active: Boolean = true;

  destroyed: Boolean = false;

  queryKey: string;

  queryFn: QueryFunction;
  
  queryType: 'query' | 'mutation';

  cacheTime: number = 5 * 60 * 1000;

  staleTime: number = 0;

  cacheTimeoutKey = null;

  currentQuery: Promise<any> = null;

  queryState: QueryState = {
    data: null,
    dataUpdatedAt: null,
    error: null,
    errorUpdatedAt: null,
    failureCount: 0,
    status: 'loading',
    isPaused: false,
    isFetching: false,
    isInvalidated: false,
  }

  static from(obj: Query, options) {
    return new Query(options);
  }

  constructor({
    initialData,
    initialDataUpdatedAt = Date.now(),
    queryFn,
    queryKey,
    queryType = 'query',
  }: QueryOptions) {
    super();
    this.queryKey = this.hashQueryKey(queryKey);
    this.queryFn = queryFn;
    this.queryType = queryType;
    if(typeof initialData === 'undefined') {
      return;
    }
    this.queryState.data = initialData;
    this.queryState.dataUpdatedAt = new Date(initialDataUpdatedAt).valueOf();
  }
  
  // messy, plz don't look
  private hashQueryKey(key): string {
    if(Array.isArray(key)) {
      key = [key];
    }
    const serialize = (key: any) => {
      if(Array.isArray(key)) {
        return key.map(serialize).join(',');
      }
      if(typeof key === 'object' && key !== null) {
        return Object.entries(key)
          .filter(([k, v]) => typeof v !== 'undefined')
          .sort(([k1], [k2]) => k1.localeCompare(k2))
          .map(([k, v]) => `${k}=${serialize(v)}`)
          .join('&');
      }
      return typeof key === "string" ? `"${key}"` : `${key}`;
    };
    return serialize(key);
  }

  private getQueryContext({variables}): QueryFunctionContext {
    const controller = new AbortController();
    return {
      variables,
      queryKey: this.queryKey,
      signal: controller.signal,
    };
  }

  private isStale(staleTime: number = 0) {
    if(this.queryState.data === null) {
      return true;
    }
    const {dataUpdatedAt, errorUpdatedAt} = this.queryState;
    const isDataStale = dataUpdatedAt + staleTime < Date.now();
    const isErrorStale = errorUpdatedAt + staleTime < Date.now();
    return isDataStale || isErrorStale;
  }

  private getQuery(context) {
    if(!this.isStale(context.staleTime)) {
      return this.queryState.data;
    }
    // Ensure only one instance of the function is running at a time no matter how many times fetch is called
    // Might be better to just not call fetch if the query is already running instead...
    if(!this.currentQuery) {
      const currentQuery = this.queryFn(context);
      if(currentQuery instanceof Promise) {
        this.currentQuery = currentQuery.finally(() => {
          this.currentQuery = null;
        });
      }
    }
    return this.currentQuery;
  }

  // TODO: optimize this to batch changes
  private setState(newState) {
    Object.assign(this.queryState, newState);
    this.emit('update', this.state());
  }

  private setCacheTimer() {
    clearTimeout(this.cacheTimeoutKey);
    this.cacheTimeoutKey = setTimeout(() => {
      this.destroy();
    }, this.cacheTime);
  }

  async fetch({variables} : QueryFetchOptions = {}) {
    this.setState({isFetching: true});
    // TODO: Notify listeners of loading state change
    let data = null;
    let error = null;
    try {
      const context = this.getQueryContext({variables});
      data = await this.getQuery(context);
      this.setState({
        data,
        status: 'success',
        failureCount: 0,
        dataUpdatedAt: Date.now(),
      });
      this.emit('success', data, this);
    } catch(err) {
      error = err;
      this.setState({
        error,
        errorUpdatedAt: Date.now(),
        failureCount: this.queryState.failureCount + 1,
        status: 'error',
      });
      this.emit('error', err, this);
    }
    this.setState({isFetching: false, isFetched: true, isLoading: false});
    this.emit('settled', data, error, this);
    this.setCacheTimer();
  }

  setData(dataOrUpdater) {
    let data = dataOrUpdater;
    if(typeof dataOrUpdater === 'function') {
      data = dataOrUpdater(this.queryState.data);
    }
    this.setState({data});
  }

  invalidate(options?: InvalidateOptions) {

  }

  state(): QueryState {
    return {...this.queryState};
  }

  matches(filters: QueryFilters | string) {
    if(typeof filters === 'string') {
      filters = {queryKey: filters};
    }
    const {queryKey, exact, predicate} = filters;
    const hashedKey = this.hashQueryKey(queryKey);
    if(
      queryKey
      && (exact && this.queryKey !== hashedKey)
      || !this.queryKey.startsWith(hashedKey)
    ) {
      return false;
    }
    if(typeof predicate === 'function' && !predicate(this)) {
      return false;
    }
    return true;
  }

  destroy() {
    this.destroyed = true;
    clearTimeout(this.cacheTimeoutKey);
    // todo: clean up observers and remove query from QueryCache
  }
}

// Allows you to watch for changes to one or more queries
export class QueryObserver {
  queryClient: QueryClient;

  listeners: QueryListener[] = [];

  query: Query;

  constructor(
    queryClient: QueryClient,
    options: QueryOptions,
  ) {
    this.queryClient = queryClient;
    const {queryKey} = options;
    this.query = queryClient.getOrCreateQuery(queryKey, options);
    this.query.on('update', this.onUpdate.bind(this));
  }

  private onUpdate(newState) {
    this.listeners.forEach(listener => listener(newState));
  }

  subscribe(listener: QueryListener) {
    this.listeners.push(listener);
    this.query.fetch();
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(query: Query) {
    this.listeners.forEach(listener => listener(query.state()));
  }
}

// Holds on to all the Query instances and supplies methods for finding them using filters
export class QueryCache {
  queries: Query[] = [];

  onError = null;

  onSuccess = null;

  constructor({onError, onSuccess}) {
    this.onError = onError;
    this.onSuccess = onSuccess;
  }

  cache(query: Query) {
    if(this.onError) {
      query.on('error', this.onError);
    }
    if(this.onSuccess) {
      query.on('success', this.onSuccess);
    }
    // This function is called when a query is created by the QueryClient (see QueryClient.getOrCreateQuery)
    // Since Marko deep freezes the object if you assign it, this line throws an error
    this.queries.push(query);
  }

  remove(query: Query) {
    // TODO
  }

  find(filters: string | QueryFilters) {
    return this.findAll(filters).shift();
  }

  findAll(filters: string | QueryFilters) {
    return this.queries.filter(query => query.matches(filters));
  }

  subscribe() {
    // TODO
    return () => {};
  }

  clear() {
    this.queries.forEach(query => query.destroy());
  }
}

// Extends Function in order to bypass Marko's deep freeze: https://github.com/marko-js/tags-api-preview/blob/3260fe8e97139e9dd58e1e17481b693729db92b4/src/util/deep-freeze/index-browser.ts
// Another option would be to pre-freeze the object so that the freeze remains shallow
export class QueryClient extends Function {
  queryCache: QueryCache;

  mutationCache: QueryCache;

  defaultOptions: Record<string, any>; // TODO: Make a type for this

  constructor({
    queryCache = new QueryCache({onError: null, onSuccess: null}),
    mutationCache = new QueryCache({onError: null, onSuccess: null}),
    defaultOptions = {},
  } = {}) {
    super();
    this.queryCache = queryCache;
    this.mutationCache = mutationCache;
    this.defaultOptions = defaultOptions;
  }

  getQuery(key) {
    return this.queryCache.find(key);
  }

  getOrCreateQuery(key, options?: QueryOptions) {
    let query = this.queryCache.find(key);
    if(!query) {
      // TODO: Also fill with default options
      query = new Query({...this.defaultOptions, ...options, queryKey: key});
      this.queryCache.cache(query);
    }
    return query;
  }

  getQueryData(key): unknown | undefined {
    const query = this.getQuery(key);
    return query?.queryState.data;
  }

  setQueryData(key, dataOrUpdater) {
    const query = this.getOrCreateQuery(key);
    query.setData(dataOrUpdater);
  }

  getQueryState(key): QueryState | undefined {
    const query = this.getQuery(key);
    return query?.state();
  }

  fetchQuery(options) {
    const {queryKey} = options;
    const query = this.getOrCreateQuery(queryKey);
    query.fetch();
  }

  isMutating(filters: QueryFilters) {
    return this.mutationCache.findAll({...filters, fetching: true}).length > 0;
  }

  isFetching(filters: QueryFilters) {
    return this.queryCache.findAll({...filters, fetching: true}).length;
  }

  invalidateQueries(
    key, 
    filters: QueryFilters & QueryActions<unknown>,
    invalidateOptions: InvalidateOptions,
  ) {
    this.queryCache.findAll({queryKey: key, ...filters}).forEach(query => {
      query.invalidate(invalidateOptions);
    });
  }

  cancelQueries(keyOrFilters: string | QueryFilters) {
    // TODO
  }

  removeQueries(keyOrFilters) {
    // TODO
  }

  refetchQueries(keyOrFilters: string | QueryFilters) {
    // TODO
  }

  prefetchQuery(key: string, fn) {
    // TODO
  }
}
