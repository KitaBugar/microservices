import { ApiUrl } from "@/config/config";
import { getCookie } from "../utils";

export async function createGym(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/gym`, {
            method: 'POST',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
            body: formData,
          });
          
        return await response.json()
    } catch (error) {
        throw error
    }
}
export async function confirmKTP(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/user/ktp/confirmation`, {
            method: 'PUT',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
            body: formData,
          });
          
        return await response.json()
    } catch (error) {
        throw error
    }
}