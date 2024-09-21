export class Maybe<T> {
  private constructor(
    private _value?: T,
    private _error?: Error,
  ) {}

  get value(): T {
    if (!this.value) {
      throw new Error(`No value: ${this._error?.message}`);
    }
    return this._value!;
  }

  get error(): Error {
    if (!this._error) {
      throw new Error("No error on maybe");
    }
    return this._error;
  }

  hasError() {
    return !!this._error;
  }

  hasValue() {
    return !!this.value;
  }

  public static withValue<T>(value: T): Maybe<T> {
    return new Maybe(value, undefined);
  }
  public static withError<T>(error: Error): Maybe<T> {
    return new Maybe<T>(undefined, error);
  }
}
