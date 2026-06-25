'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const updateBookingStatus = async (id, status) => {
    const result = await serverMutation(`/api/bookings/${id}`, { status }, 'PATCH');
    revalidatePath('/dashboard/vendor/bookings');
    revalidatePath('/dashboard/user/booked-tickets');
    return result;
};

export const cancelBooking = async (id) => {
    const result = await serverMutation(`/api/bookings/${id}`, {}, 'DELETE');
    revalidatePath('/dashboard/user/booked-tickets');
    return result;
};