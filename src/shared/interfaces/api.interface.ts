export interface IPasswordFlowError extends Error {
  body: {
    error: string;
    error_description: string;
    errors: { code: string; message: string }[];
    message: string;
    statusCode: number;
  };
}
