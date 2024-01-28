export type ValidationErrors = Array<ValidationError>;
export interface ValidationError {
	path: string;
	message: string;
}
