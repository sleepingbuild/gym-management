import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Tat ca routes deu can dang nhap (MEMBER dat lich cho chinh minh)
router.get("/trainers", authenticate, bookingController.getAvailableTrainers);
router.get(
    "/trainers/:trainerId/available-slots",
    authenticate,
    bookingController.getAvailableSlots,
);
router.post("/", authenticate, bookingController.createBooking);
router.get("/my", authenticate, bookingController.getMyBookings);
router.patch("/:id/cancel", authenticate, bookingController.cancelBooking);

export default router;