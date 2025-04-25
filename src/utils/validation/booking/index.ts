import { z } from 'zod';

export const bookingSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  parkingSlotId: z.string().uuid().optional(),
  parkingLotId: z.string().uuid().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  vehicleNumber: z.string().optional(),
  bookingStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  amount: z.string().optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  otp: z.string().optional(),
  otpExpiry: z.string().optional(),
  otpVerified: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
});
