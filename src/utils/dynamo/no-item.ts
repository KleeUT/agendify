export class NoItem extends Error {
  constructor(
    private _message: string,
    private _itemType: string,
    private _meta: Array<Record<string, unknown>> = [],
  ) {
    super(_message);
  }
  get message() {
    return this._message;
  }
  get itemType() {
    return this._itemType;
  }
  get metaData() {
    return this._meta;
  }
}
