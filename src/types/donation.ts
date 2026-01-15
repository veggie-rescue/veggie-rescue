import { z } from 'zod';

// Validation schemas
export const donationItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.enum(['lb', 'kg', 'items', 'boxes']),
});

export const createDonationSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  donorEmail: z.string().email('Invalid email address'),
  donorPhone: z.string().optional(),
  items: z.array(donationItemSchema).min(1, 'At least one item is required'),
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  pickupDate: z.string().datetime({ message: 'Invalid date format' }),
  notes: z.string().optional(),
});

export const updateDonationSchema = createDonationSchema.partial().extend({
  status: z
    .enum(['pending', 'scheduled', 'completed', 'cancelled'])
    .optional(),
});

// Types derived from schemas
export type DonationItem = z.infer<typeof donationItemSchema>;
export type CreateDonationInput = z.infer<typeof createDonationSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;

export type DonationStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

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
