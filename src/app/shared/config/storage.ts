import { BehaviorSubject } from "rxjs";

export class StorageSubject<T> extends BehaviorSubject<T> {
  constructor(
    private key: string,
    private defaultValue: T,
  ) {
    let value: T;

    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        value = JSON.parse(item);
      }
    } catch (e) {}

    value ||= defaultValue;

    super(value);
  }

  next(value: T): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch (e) {}

    super.next(value);
  }

  remove(): void {
    try {
      window.localStorage.removeItem(this.key);
    } catch (e) {}

    super.next(this.defaultValue);
  }
}
