import { 
  Query, 
  QueryState, 
  QueryFilters, 
  InvalidateOptions, 
  QueryOptions,
  QueryActions
} from './Query';
import { QueryCache } from './QueryCache';

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
