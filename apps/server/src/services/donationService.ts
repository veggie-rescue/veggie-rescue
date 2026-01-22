import { v4 as uuidv4 } from 'uuid';

import type {
  CreateDonationInput,
  Donation,
  UpdateDonationInput,
} from '../types/donation';

// In-memory store (replace with database in production)
const donations: Map<string, Donation> = new Map();

export const donationService = {
  findAll(): Donation[] {
    return Array.from(donations.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  findById(id: string): Donation | undefined {
    return donations.get(id);
  },

  create(input: CreateDonationInput): Donation {
    const now = new Date().toISOString();
    const donation: Donation = {
      id: uuidv4(),
      ...input,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    donations.set(donation.id, donation);
    return donation;
  },

  update(id: string, input: UpdateDonationInput): Donation | undefined {
    const existing = donations.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Donation = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    donations.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return donations.delete(id);
  },

  // For testing purposes
  clear(): void {
    donations.clear();
  },
};
