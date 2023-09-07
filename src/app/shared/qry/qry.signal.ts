import { Signal, effect, signal } from "@angular/core";
import {
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";

export const query = <
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  client: QueryClient,
  options: Signal<
    QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  >
): Signal<QueryObserverResult<TData, TError>> => {
  const defaultedOptions = client.defaultQueryOptions(options());
  defaultedOptions._optimisticResults = "optimistic";

  const observer = new QueryObserver(client, defaultedOptions);

  const optimisticResult = observer.getOptimisticResult(defaultedOptions);

  const result = signal(optimisticResult);

  const unSubscribe = observer.subscribe((newResult) => {
    result.set(observer.trackResult(newResult));
  });

  effect(() => observer.setOptions(options()), { allowSignalWrites: true });

  effect((onCleanup) => onCleanup(unSubscribe));

  return result;
};

export const infiniteQuery = <
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey = QueryKey
>(
  client: QueryClient,
  options: Signal<
    InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  >
): Signal<InfiniteQueryObserverResult<TData, TError>> => {
  const defaultedOptions = client.defaultQueryOptions(options());
  defaultedOptions._optimisticResults = "optimistic";

  const observer = new InfiniteQueryObserver(client, defaultedOptions);

  const optimisticResult = observer.getOptimisticResult(defaultedOptions);

  const result = signal(optimisticResult);

  const unSubscribe = observer.subscribe((newResult) => {
    result.set(observer.trackResult(newResult) as any);
  });

  effect(() => observer.setOptions(options()), { allowSignalWrites: true });

  effect((onCleanup) => onCleanup(unSubscribe));

  return result;
};
