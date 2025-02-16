import { ApiUrl } from "@/config/config";
import { getCookie } from "../utils";

export async function createMethod(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/method`, {
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
export async function updateMethod(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/method`, {
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