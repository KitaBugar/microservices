'use client';

import { useCallback, useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
const Dialog = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.Dialog));
const DialogContent = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogContent));
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogHeader));
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogTitle));
const DialogTrigger = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogTrigger));


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ApiUrl } from "@/config/config";
import { formatPrice, getCookie } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { createPackage, editPackage } from "@/lib/api/membership_options";
import { createCheckIn } from "@/lib/api/membership";


type UserData = {
  id: number;
  name: string;
  phone_number: string;
  email: string;
}
type MembershipOptionData = {
  id: number;
  name: string;
  description: string;
  price: string;
}
type MembershipData = {
  id: number;
  name: string;
  description: string;
  features: string;
  card_number: string;
  user : UserData
  membership_option : MembershipOptionData
}
type CheckData = {
  id: number;
  name: string;
  description: string;
  membership : MembershipData;
  created_at: string;
  updated_at: string;
}


type ApiResponse = {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: CheckData[];
};

export default function PackagePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const { toast } = useToast();
  const params = useParams()


  const getDataPackage = useCallback( async () => {
    try {
      const response = await fetch(`${ApiUrl}/membership/${params.gymID}/check`, {
        headers: {
          "Authorization": `Bearer ${getCookie("token")}`
        }
      })
      const resGym: ApiResponse = await response.json()
      if (resGym instanceof Error) {
        throw resGym.message
      }
      setData(resGym)
    } catch (error) {
      console.log(error);
      toast({
        title: "Email atau Password salah",
      })
    }
  },[params.gymID, toast])


  async function handleSave (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createCheckIn(formData, params)
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      toast({
        title: String(errorMessage),
      });
    }
  };
  useEffect(() => {
    getDataPackage();
}, [getDataPackage]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Check-in Membership</h1>
      </div>
      <form onSubmit={handleSave} className="mb-4">
      <label htmlFor="card_number" className="text-sm font-medium mb-2">Masukkan Kode</label>
      <div className="flex justify-center items-center w-full gap-3">
        <div className="w-full">
            <Input
              id="card_number"  
              className="w-full"
              name="card_number"
              type="text"
              required
              />
          </div>
          <Button type="submit">Cek Kode</Button> 
        </div>
      </form>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Tanggal Check-in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items != undefined ? (
                data?.items.map((data :CheckData) => {
                  const a = new Date(data.created_at);
                  const formattedDate = a.toISOString().replace('T', ' ').slice(0, 19);
                              
                 return (
                 <TableRow key={data.id}>
                    <TableCell>{data.membership.user.name}</TableCell>
                    <TableCell>{data.membership.membership_option.name}</TableCell>
                    <TableCell>{formatPrice(parseInt(data.membership.membership_option.price))}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                  </TableRow>)
                })) :
                <TableRow>
                <TableCell className="text-center" colSpan={6}>Belum Ada Check-in</TableCell>
              </TableRow>
                }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}