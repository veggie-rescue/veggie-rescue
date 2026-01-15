import { Router } from 'express';

import { validate } from '../middleware/validate';
import { donationService } from '../services/donationService';
import { createDonationSchema, updateDonationSchema } from '../types/donation';
import { NotFoundError } from '../types/errors';

const router = Router();

// GET /donations - List all donations
router.get('/', (req, res) => {
  const donations = donationService.findAll();
  res.json({ data: donations });
});

// GET /donations/:id - Get a single donation
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const donation = donationService.findById(id);

  if (!donation) {
    next(new NotFoundError('Donation'));
    return;
  }

  res.json({ data: donation });
});

// POST /donations - Create a new donation
router.post('/', validate(createDonationSchema), (req, res) => {
  const donation = donationService.create(req.body);
  res.status(201).json({ data: donation });
});

// PATCH /donations/:id - Update a donation
router.patch('/:id', validate(updateDonationSchema), (req, res, next) => {
  const id = req.params.id as string;
  const donation = donationService.update(id, req.body);

  if (!donation) {
    next(new NotFoundError('Donation'));
    return;
  }

  res.json({ data: donation });
});

// DELETE /donations/:id - Delete a donation
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  const deleted = donationService.delete(id);

  if (!deleted) {
    next(new NotFoundError('Donation'));
    return;
  }

  res.status(204).send();
});

export default router;
