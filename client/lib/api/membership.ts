import { ApiUrl } from "@/config/config";
import { getCookie } from "../utils";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function getAllreadyCheckIn(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/membership`, {
            method: 'GET',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
          });
          
        return await response.json()
    } catch (error) {
        throw error
    }
}
export async function createCheckIn(formData: FormData, params : Params) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/membership/${params.gymID}/check`, {
            method: 'POST',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
         }
        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function handleConfirmationMember(formData :FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/transaction`, {
            method: 'PUT',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
            body: formData,
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
         }
        return await response.json()
    } catch (error) {
        throw error
    }
}