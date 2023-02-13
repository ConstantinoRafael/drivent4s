import { cannotBooking, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-respository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  const data = {
    id: booking.id,
    Room: booking.Room,
  };

  return data;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBooking();
  }

  if (!roomId) {
    throw notFoundError();
  }

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity === 0) {
    throw cannotBooking();
  }

  const bookingData = {
    userId,
    roomId,
  };

  await bookingRepository.createBooking(bookingData);

  const bookingId = await bookingRepository.findBooking(userId);

  return bookingId;
}

const bookingService = {
  getBooking,
  createBooking,
};

export default bookingService;
