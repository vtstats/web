import { isPlatformServer } from "@angular/common";
import {
  PLATFORM_ID,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";
import { QUERY_CLIENT } from "../tokens";

export const query = <
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  objOrFun:
    | QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    | (() => QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
      >)
): Signal<QueryObserverResult<TData, TError>> => {
  const client = inject(QUERY_CLIENT);

  const options = typeof objOrFun === "function" ? objOrFun() : objOrFun;

  if (isPlatformServer(inject(PLATFORM_ID))) {
    const data: any = client.getQueryData(options.queryKey!);
    return signal(<any>{
      data,
      error: null,
      isLoading: !data,
      isSuccess: !!data,
      isError: false,
      isFetching: !data,
      status: data ? "success" : "loading",
    });
  }

  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = "optimistic";

  const observer = new QueryObserver(client, defaultedOptions);

  const optimisticResult = observer.getOptimisticResult(defaultedOptions);

  const result = signal(optimisticResult);

  const unSubscribe = observer.subscribe((newResult) => {
    result.set(observer.trackResult(newResult));
  });

  if (typeof objOrFun === "function") {
    const optionsSignal = computed(objOrFun);
    effect(
      () => {
        observer.setOptions(optionsSignal());
      },
      { allowSignalWrites: true }
    );
  }

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
  options: () => InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >
): Signal<InfiniteQueryObserverResult<TData, TError>> => {
  const client = inject(QUERY_CLIENT);

  const defaultedOptions = client.defaultQueryOptions(options());
  defaultedOptions._optimisticResults = "optimistic";

  const observer = new InfiniteQueryObserver(client, defaultedOptions);

  const optimisticResult = observer.getOptimisticResult(defaultedOptions);

  const result = signal(optimisticResult);

  const unSubscribe = observer.subscribe((newResult) => {
    result.set(observer.trackResult(newResult) as any);
  });

  const optionsSignal = computed(options);
  effect(
    () => {
      observer.setOptions(optionsSignal());
    },
    { allowSignalWrites: true }
  );

  effect((onCleanup) => onCleanup(unSubscribe));

  return result;
};
