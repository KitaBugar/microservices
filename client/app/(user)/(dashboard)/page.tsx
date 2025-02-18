'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiUrl } from "@/config/config";
import { testimonials } from "@/lib/data";
import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";

type GymData = {
  id: number;
  name: string;
  description: string;
  address: string;
  images: string;
  city_id: string;
  province_id: string;
  start_time: string;
  end_time: string;
}

type ApiResponse<T> = {
current_page: string;
next_page: string | null;
prev_page: string | null;
message: string;
items: T[];
};
export default function DashboardPage() {
  const [data, setData] = useState<ApiResponse<GymData> | null>(null);
  async function getDataGym() {
    try {
      const response = await fetch(`${ApiUrl}/gym/owner`, {
        headers:{
          "Authorization": `Bearer ${getCookie("token")}`
        }
      })
      const resGym: ApiResponse<GymData> = await response.json()
      setData(resGym)   
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    getDataGym()
  },[])
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Selamat Datang!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Semoga harimu menyenangkan!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{`${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()} `}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">List Gym</h2>
        <div className="space-y-4">
          {data?.items?.map((gym :GymData) => (
            <Card key={gym.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{gym.name}</p>
                    <p className="text-sm text-muted-foreground">{gym.start_time}</p>
                  </div>
                  {/* <div className="text-sm text-muted-foreground">
                    {new Date(gym.n).toLocaleDateString()}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))}
          {(!data?.items) ? (
             <Card>
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium">Belum ada data gym</p>
                   <p className="text-sm text-muted-foreground"></p>
                 </div>
               </div>
             </CardContent>
           </Card>
          ) : ''} 
        </div>
      </div>
    </div>
  );
}