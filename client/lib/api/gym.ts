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
export async function editGym(formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/gym/${formData.get("gym_id")}`, {
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
type Gym = {
    id: number;
  };
export async function deletedGym(formData : Gym) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/gym/${formData.id}`, {
            method: 'DELETE',
            headers: ({
                "Authorization": `Bearer ${token}`,
              }),
          });
          
        return await response.json()
    } catch (error) {
        throw error
    }
}