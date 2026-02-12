export abstract class CustomError extends Error {
  custom: boolean = true;
  type: string;
  data: any;

  protected constructor(message?: string) {
    super(message);
  }
}
