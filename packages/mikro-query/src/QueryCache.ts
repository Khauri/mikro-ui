import { Query, QueryFilters } from './Query';

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
