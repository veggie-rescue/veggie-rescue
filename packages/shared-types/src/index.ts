// Donation types
export type DonationStatus =
  | 'pending'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export type DonationUnit = 'lb' | 'kg' | 'items' | 'boxes';

export interface DonationItem {
  name: string;
  quantity: number;
  unit: DonationUnit;
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  items: DonationItem[];
  pickupAddress: string;
  pickupDate: string;
  status: DonationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationInput {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  items: DonationItem[];
  pickupAddress: string;
  pickupDate: string;
  notes?: string;
}

export interface UpdateDonationInput extends Partial<CreateDonationInput> {
  status?: DonationStatus;
}

// API response types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type DonationResponse = ApiResponse<Donation>;
export type DonationListResponse = ApiResponse<Donation[]>;
