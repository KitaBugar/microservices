'use client';

import { useEffect, useState } from "react";
import { gyms } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ApiUrl, Url } from "@/config/config";
import { getCookie } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { confirmKTP } from "@/lib/api/admin";

type UserData = {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    identify: string;
}

type ApiResponse<T> = {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: T[];
};

export default function GymsPage() {
  const [data, setData] = useState<ApiResponse<UserData> | null>(null);
  const [deleteGym, setDeleteGym] = useState<UserData | null>(null);
  const { toast } = useToast();



  async function getDataGym() {
    try {
      const response = await fetch(`${ApiUrl}/user/ktp/confirmation`, {
        headers:{
          "Authorization": `Bearer ${getCookie("token")}`
        }
      })
      const resGym: ApiResponse<UserData> = await response.json()
      setData(resGym)   
      
    } catch (error) {
      console.log(error);
      
    }
  }


  async function handleSave (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await confirmKTP(formData)
      await getDataGym();
      console.log(res.message);
      
      toast({
        title: `${res.message}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getDataGym()
  },[])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Konfirmasi KTP</h1>
      </div>

      <Card>
        <CardContent className="p-6">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nomor HP</TableHead>
                <TableHead>KTP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items != undefined ? (
                data?.items.map((user: UserData) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>
                      <Link href={`${Url}/assets/ktp/${user.identify}`} target="_blank">
                        <Image src={`${Url}/assets/ktp/${user.identify}`} alt="image-ktp" width={200} height={100} className="object-cover w-[200px] h-[200px]"/>
                      </Link>
                    </TableCell>
                    <TableCell className="flex justify-end items-center gap-2 h-full">
                      <form onSubmit={handleSave}>
                        <input type="text" hidden name="user_id" value={user.id} />
                        <input type="text" hidden name="confirmation" value="success" />
                        <Button
                          variant="ghost"
                          className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-600 text-white"
                          type="submit"
                        >
                          Setuju
                        </Button>
                      </form>
                      <form onSubmit={handleSave}>
                        <input type="text" hidden name="user_id" value={user.id} />
                        <input type="text" hidden name="confirmation" value="cancel" />
                        <Button
                          variant="ghost"
                          className="py-2.5 px-6 rounded-lg text-sm font-medium bg-red-200 text-red-800"
                          type="submit"
                       >
                          Batalkan
                        </Button>
                      </form>
                      </TableCell>
                  </TableRow>
                ))) :
                <TableRow>
                <TableCell colSpan={6}>Tidak ada ktp yang perlu dikonfirmasi</TableCell>
              </TableRow>
                }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}