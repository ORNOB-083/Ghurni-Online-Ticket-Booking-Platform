'use server'
import { serverMutation, serverFetch } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const createTicket = async (data) => {
    return serverMutation('/api/tickets', data);
}

export const updateTicket = async (id, data) => {
    const result = await serverMutation(`/api/tickets/${id}`, data, 'PATCH');
    revalidatePath('/dashboard/vendor/my-tickets');
    return result;
}

export const deleteTicket = async (id) => {
    const result = await serverMutation(`/api/tickets/${id}`, {}, 'DELETE');
    revalidatePath('/dashboard/vendor/my-tickets');
    return result;
}

export const verifyTicket = async (id, verificationStatus) => {
    const result = await serverMutation(`/api/tickets/${id}/verify`, { verificationStatus }, 'PATCH');
    revalidatePath('/dashboard/admin/tickets');
    return result;
}

export const advertiseTicket = async (id, isAdvertised) => {
    const result = await serverMutation(`/api/tickets/${id}/advertise`, { isAdvertised }, 'PATCH');
    revalidatePath('/dashboard/admin/advertise');
    return result;
}