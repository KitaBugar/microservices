import { ApiUrl } from "@/config/config";
import { cookies } from 'next/headers'
import { z } from 'zod'
const formSchema = z.object({
    email: z.string(),
    password: z.string()
})
const formSchemaSignup = z.object({
    email: z.string(),
    name: z.string(),
    phone_number: z.string(),
    password: z.string()
})
export async function login(formData: FormData) {
   try {
   
    const response = await fetch(`${ApiUrl}/user/login`,{
        method: "POST",
        body: formData
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
     }

    const data = await response.json()
    const expires = new  Date()
    expires.setTime(expires.getTime() + 15 * 24 * 60 * 60 * 1000);
    document.cookie = `token=${data.items.token};expires=${expires.toUTCString()};path=/`;
    return response.ok
   } catch (error) {
       console.log(error);
        return error
   }
}

export async function signup(formData: z.infer<typeof formSchemaSignup>) {
   try {
       const formDataToSend = new FormData();
       formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone_number", formData.phone_number);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("role", "owner");
    const response = await fetch(`${ApiUrl}/user/register`,{
        method: "POST",
        body: formDataToSend
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Register failed");
     }
    return await response.json()
   } catch (error) {
    return error
   }
}