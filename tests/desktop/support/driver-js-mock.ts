export const driver = jest.fn((..._args: unknown[]) => ({
  drive: jest.fn(),
}));
