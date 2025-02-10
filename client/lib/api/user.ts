import { ApiUrl } from "@/config/config";
import { getCookie } from "../utils";

export async function getUser() {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/user/detail`, {
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
export async function getMethod () {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/method`, {
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

export async function updateUser (formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/user`, {
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

export async function uploadKTP (formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/user/ktp`, {
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

export async function createMethodPayment (formData: FormData) {
    try {
        const token = getCookie("token");
        if (!token) {
            throw new Error("Token not found.");
        }
        const response = await fetch(`${ApiUrl}/method-payment`, {
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