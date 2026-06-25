'use server'
import { serverMutation } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (userId, role) => {
    const result = await serverMutation(`/api/users/${userId}/role`, { role }, 'PATCH');
    revalidatePath('/dashboard/admin/users');
    return result;
};

export const markAsFraud = async (userId, isFraud) => {
    const result = await serverMutation(`/api/users/${userId}/fraud`, { isFraud }, 'PATCH');
    revalidatePath('/dashboard/admin/users');
    return result;
};