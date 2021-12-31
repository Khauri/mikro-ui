import { Query, QueryState, QueryOptions } from './Query';
import { QueryClient } from './QueryClient';

export type QueryListener = (queryState: QueryState) => void;

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