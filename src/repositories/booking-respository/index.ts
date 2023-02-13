import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBooking(bookingData: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      ...bookingData,
    },
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const bookingRepository = {
  findBooking,
  createBooking,
};

export default bookingRepository;
