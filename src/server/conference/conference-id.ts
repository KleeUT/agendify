export class ConferenceId {
  private constructor(private str: string) {}

  public static parse(str: string): ConferenceId {
    return new ConferenceId(str);
  }
  toString(): string {
    return this.str;
  }
}
