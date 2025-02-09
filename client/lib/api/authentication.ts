import { ApiUrl } from "@/config/config";
import { cookies } from 'next/headers'
import { z } from 'zod'
const formSchema = z.object({
    email: z.string(),
    password: z.string()
})
export async function login(formData: z.infer<typeof formSchema>) {
   try {
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    const response = await fetch(`${ApiUrl}/user/login`,{
        method: "POST",
        body: formDataToSend
    })
    const data = await response.json()
    const expires = new  Date()
    expires.setTime(expires.getTime() + 15 * 24 * 60 * 60 * 1000);
    document.cookie = `token=${data.token};expires=${expires.toUTCString()};path=/`;
    return response.ok

   } catch (error) {
    throw error
   }

    
}