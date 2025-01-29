import { defineStore } from "pinia";
import MoviesService from "@/services/moviesService";

interface BookingConfirmation {
  movie_id: string | number;
  row: number;
  seat: number;
  showdate: string;
  daytime: string;
  ticketkey?: string;
  [key: string]: any;
}

interface BookingState {
  bookingConfirmation: BookingConfirmation | null;
  bookingError: string | null;
  bookingLoading: boolean;
}

interface BookingData {
  movie_id: string | number;
  row: number;
  seat: number;
  showdate: string;
  daytime: string;
  [key: string]: any;
}

export const useBookingStore = defineStore("booking", {
  state: (): BookingState => ({
    bookingConfirmation: null,
    bookingError: null,
    bookingLoading: false,
  }),

  actions: {
    async bookPlace(bookingData: BookingData) {
      this.bookingLoading = true;
      this.bookingError = null;
      this.bookingConfirmation = null;
      try {
        const response = await MoviesService.bookPlace(bookingData);
        if (response.error_code === 0) {
          this.bookingConfirmation = response.data;
        } else {
          this.bookingError = response.error_message || "Booking failed.";
        }
      } catch (error) {
        console.error("Error booking place:", error);
        this.bookingError = "An error occurred while booking the ticket.";
      } finally {
        this.bookingLoading = false;
      }
    },

    resetBooking() {
      this.bookingConfirmation = null;
      this.bookingError = null;
    },
  },
});
