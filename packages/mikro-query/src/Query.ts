import { EventEmitter } from './EventEmitter';

export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';

export type QueryState<TData = unknown, TError = unknown> = {
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

export type QueryFilters = {
  exact?: Boolean;
  active?: Boolean;
  inactive?: Boolean;
  stale?: Boolean;
  fetching?: Boolean;
  predicate?: (query: Query) => Boolean;
  queryKey?: string;
};

export type InvalidateOptions = {
  throwOnError?: boolean;
  cancelRefetch?: boolean;
};

export type QueryFunction<TData = unknown> = (context: QueryFunctionContext<TData>) => Promise<TData> | TData;

export type QueryOptions<TData = unknown, TMeta = unknown> = {
  queryKey: string;
  queryFn?: QueryFunction;
  queryType?: 'query' | 'mutation';
  initialData?: TData;
  initialDataUpdatedAt?: Date | number;
  cacheTime?: number;
  isDataEqual?: (oldData: TData, newData: TData) => boolean;
  retry?: number | (() => number);
  meta?: TMeta,
};

export type QueryActions<TData> = {
  refetchActive?: Boolean;
  refetchInactive?: Boolean;
  refetchPage?: (page: TData, index: number, allpages: TData[]) => Boolean;
};

export type QueryFunctionContext<TData = unknown> = {
  variables: Record<string, unknown>;
  queryKey: string;
  signal: AbortSignal;
};

export type QueryFetchOptions = Record<string, any>; // TODO

export class Query extends EventEmitter {
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
    const {queryKey, exact, predicate, fetching} = filters;
    const hashedKey = this.hashQueryKey(queryKey);
    if(
      queryKey
      && (
        (exact && this.queryKey !== hashedKey)
        || !this.queryKey.startsWith(hashedKey)
      )
    ) {
      return false;
    }
    if(typeof predicate === 'function' && !predicate(this)) {
      return false;
    }
    if(fetching && !this.queryState.isFetching) {
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
