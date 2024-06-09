export type ViewModelResponse<T> = {
  error?: {
    message: string;
    statusCode: number;
  };
  viewModel?: T;
};

export class ApiResponse<T> {
  error?: {
    message: string;
    statusCode: number;
  };
  data?: T;
}
