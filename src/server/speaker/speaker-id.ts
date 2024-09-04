export class SpeakerId {
  private constructor(private value: string) {}

  public static parse(value: string): SpeakerId {
    if (typeof value !== "string") {
      throw new Error(`Format of ${value} is wrong and is ${typeof value}`);
    }
    return new SpeakerId(value);
  }
  toString(): string {
    return this.value;
  }
}
