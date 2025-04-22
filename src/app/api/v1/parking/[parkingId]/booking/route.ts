import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { prisma } from '@/lib/db'; // Add this import
import { addBooking } from '@/services/booking/addBooking';
import { getAllBooking } from '@/services/booking/getAllBooking';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { getAllParkingSlot } from '@/services/slot/getParkingSlot';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { getMeta } from '@/utils/pagination/getMeta';
import { NextRequest } from 'next/server';
import { bookingSchema } from '@/utils/validation/booking';
import { Prisma } from '@schema/index';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { getUserById } from '@/services/user/getUserById';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const { parkingId } = await params;

    if (!parkingId) {
      return ErrorResponse({
        message: 'Please provide a valid parkingId',
        status: 400,
      });
    }
    const isParkingExist = await getParkingLotById({ id: parkingId });

    if (!isParkingExist) {
      return ErrorResponse({
        message: 'Parking lot not found',
        status: 404,
      });
    }

    const [booking, total] = await getAllBooking({ where: { parkingLotId: parkingId } });

    return SuccessResponse({
      message: 'Booking found',
      status: 200,
      data: booking,
      meta: getMeta({ total: total, currentPage: page }),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({
        message: 'Please provide a valid parkingId',
        status: 400,
      });
    }
    const isTokenNotValid = await tokenMiddleware(request);
    if (isTokenNotValid) {
      return isTokenNotValid;
    }
    const body = bookingSchema
      .pick({
        userId: true,
        startTime: true,
        endTime: true,
        vehicleNumber: true,
      })
      .parse(await request.json());

    const user = await getUserById({ id: body.userId });
    if (!user) {
      return ErrorResponse({
        message: 'Unauthorized',
        status: 401,
      });
    }
    // Check if parking exists
    const parkingLot = await getParkingLotById({ id: parkingId });
    if (!parkingLot) {
      return ErrorResponse({
        message: 'Parking lot not found',
        status: 404,
      });
    }

    // Find an available slot matching the vehicle type (if specified)
    const [availableSlots, total] = await getAllParkingSlot({
      where: {
        parkingLotId: parkingId,
        isOccupied: false,
      },
    });

    if (!availableSlots || availableSlots.length === 0) {
      return ErrorResponse({
        message: 'No available slots in this parking lot' + total + 'Total slot',
        status: 400,
      });
    }

    const slot = availableSlots[0];

    // Calculate amount based on parking price and duration
    const startDate = new Date(body.startTime);
    const endDate = new Date(body.endTime);
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const amount = parkingLot.price * durationHours;

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // TODO: Add 1 hour for otp to expire else otp will be expired
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 24); // OTP valid for 24 hours
    // Create booking
    const data: Prisma.BookingCreateInput = {
      amount,
      otp,
      otpExpiry,
      vehicleNumber: body.vehicleNumber || null,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      bookingStatus: 'PENDING',
      transactionId: null,
      parkingLot: { connect: { id: parkingId } },
      endTime: endDate,
      startTime: startDate,
      cancelledAt: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      otpVerified: false,
      parkingSlot: { connect: { id: slot.id } },
      user: { connect: { id: body.userId } },
    };

    const booking = await addBooking({
      data: data,
    });

    // Update slot to occupied
    await prisma.parkingSlot.update({
      where: { id: slot.id },
      data: {
        isOccupied: true,
        expiresAt: endDate,
        parkingLot: { connect: { id: parkingId } },
      },
    });

    return SuccessResponse({
      message: 'Booking created successfully',
      status: 201,
      data: booking,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
