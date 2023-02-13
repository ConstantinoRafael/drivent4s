import { ApplicationError } from "@/protocols";

export function cannotBooking(): ApplicationError {
  return {
    name: "CannotBooking",
    message: "Cannot booking!",
  };
}