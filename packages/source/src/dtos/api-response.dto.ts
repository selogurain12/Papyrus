// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class ApiResponse<Data> {
  public status!: number;

  public body!: Data;

  public headers!: Headers;
}
