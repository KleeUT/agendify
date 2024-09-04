export class SessionId {
  private constructor(private str: string) {}

  public static parse(str: string): SessionId {
    return new SessionId(str);
  }
  toString(): string {
    return this.str;
  }
}
