import {
  InfiniteData,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from "@tanstack/query-core";

export class InfQry<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
> extends InfiniteQueryObserver<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey
> {
  private _options: InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;

  constructor(
    client: QueryClient,
    opts: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  ) {
    const defaultedOptions = client.defaultQueryOptions(opts);
    defaultedOptions._optimisticResults = "optimistic";
    super(client, defaultedOptions);
    this._options = opts;
  }

  updateQueryKey(queryKey: TQueryKey) {
    this._options.queryKey = queryKey;
    this.setOptions(this._options);
  }

  updateSelect(
    select:
      | ((data: InfiniteData<TQueryData>) => InfiniteData<TData>)
      | undefined
  ) {
    this._options.select = select;
    this.setOptions(this._options);
  }
}

export class Qry<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
> extends QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
  private _options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;

  constructor(
    client: QueryClient,
    opts: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  ) {
    const defaultedOptions = client.defaultQueryOptions(opts);
    defaultedOptions._optimisticResults = "optimistic";
    super(client, defaultedOptions);
    this._options = opts;
  }

  updateQueryKey(queryKey: TQueryKey) {
    this._options.queryKey = queryKey;
    this.setOptions(this._options);
  }

  updateSelect(select: ((data: TQueryData) => TData) | undefined) {
    this._options.select = select;
    this.setOptions(this._options);
  }
}
