import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { donationService } from '../services/donationService';

const validDonation = {
  donorName: 'John Doe',
  donorEmail: 'john@example.com',
  donorPhone: '555-1234',
  items: [
    { name: 'Carrots', quantity: 10, unit: 'lb' as const },
    { name: 'Lettuce', quantity: 5, unit: 'boxes' as const },
  ],
  pickupAddress: '123 Farm Road, Springfield',
  pickupDate: '2024-12-15T10:00:00.000Z',
  notes: 'Please call before arriving',
};

describe('Donations API', () => {
  beforeEach(() => {
    donationService.clear();
  });

  describe('POST /donations', () => {
    it('should create a donation with valid data', async () => {
      const response = await request(app)
        .post('/donations')
        .send(validDonation);

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        donorName: validDonation.donorName,
        donorEmail: validDonation.donorEmail,
        status: 'pending',
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const response = await request(app).post('/donations').send({});

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'donorName' })
      );
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/donations')
        .send({ ...validDonation, donorEmail: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'donorEmail',
          message: 'Invalid email address',
        })
      );
    });

    it('should reject empty items array', async () => {
      const response = await request(app)
        .post('/donations')
        .send({ ...validDonation, items: [] });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'items',
          message: 'At least one item is required',
        })
      );
    });

    it('should reject invalid item quantity', async () => {
      const response = await request(app)
        .post('/donations')
        .send({
          ...validDonation,
          items: [{ name: 'Apples', quantity: -5, unit: 'lb' }],
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'items.0.quantity' })
      );
    });
  });

  describe('GET /donations', () => {
    it('should return empty array when no donations', async () => {
      const response = await request(app).get('/donations');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return all donations sorted by newest first', async () => {
      await request(app).post('/donations').send(validDonation);
      await request(app)
        .post('/donations')
        .send({ ...validDonation, donorName: 'Jane Doe' });

      const response = await request(app).get('/donations');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].donorName).toBe('Jane Doe');
    });
  });

  describe('GET /donations/:id', () => {
    it('should return a donation by id', async () => {
      const createRes = await request(app)
        .post('/donations')
        .send(validDonation);
      const donationId = createRes.body.data.id;

      const response = await request(app).get(`/donations/${donationId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(donationId);
    });

    it('should return 404 for non-existent donation', async () => {
      const response = await request(app).get(
        '/donations/non-existent-id'
      );

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Donation not found');
    });
  });

  describe('PATCH /donations/:id', () => {
    it('should update donation status', async () => {
      const createRes = await request(app)
        .post('/donations')
        .send(validDonation);
      const donationId = createRes.body.data.id;

      const response = await request(app)
        .patch(`/donations/${donationId}`)
        .send({ status: 'scheduled' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('scheduled');
      expect(response.body.data.updatedAt).not.toBe(
        createRes.body.data.updatedAt
      );
    });

    it('should update multiple fields', async () => {
      const createRes = await request(app)
        .post('/donations')
        .send(validDonation);
      const donationId = createRes.body.data.id;

      const response = await request(app)
        .patch(`/donations/${donationId}`)
        .send({
          donorName: 'Updated Name',
          notes: 'Updated notes',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.donorName).toBe('Updated Name');
      expect(response.body.data.notes).toBe('Updated notes');
    });

    it('should return 404 for non-existent donation', async () => {
      const response = await request(app)
        .patch('/donations/non-existent-id')
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
    });

    it('should reject invalid status value', async () => {
      const createRes = await request(app)
        .post('/donations')
        .send(validDonation);
      const donationId = createRes.body.data.id;

      const response = await request(app)
        .patch(`/donations/${donationId}`)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /donations/:id', () => {
    it('should delete a donation', async () => {
      const createRes = await request(app)
        .post('/donations')
        .send(validDonation);
      const donationId = createRes.body.data.id;

      const deleteRes = await request(app).delete(`/donations/${donationId}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/donations/${donationId}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent donation', async () => {
      const response = await request(app).delete(
        '/donations/non-existent-id'
      );

      expect(response.status).toBe(404);
    });
  });
});
