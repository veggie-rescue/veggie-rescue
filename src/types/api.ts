import type { Donation } from './donation';

// Success response wrapper
export interface ApiResponse<T> {
  data: T;
}

// Error response
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// Specific response types
export type DonationResponse = ApiResponse<Donation>;
export type DonationListResponse = ApiResponse<Donation[]>;
