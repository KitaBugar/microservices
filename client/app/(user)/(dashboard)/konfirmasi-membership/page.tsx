'use client';

import { useEffect, useState } from "react";
import { gyms } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";
import { ApiUrl } from "@/config/config";
import { formatPrice, getCookie } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { handleConfirmationMember } from "@/lib/api/membership";

type TransactionData = {
    id: number;
    name: string;
    image: {
      image: string;
      image_url: string;
    };
    method_name: string;
    price: number;
    gym: GymData;
    user: UserData;
    membership: MemberData;
    membership_option: MemberOData;
}

type GymData = {
  id: number;
  name: string;
  description: string;
  address: string;
}
type UserData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}
type MemberOData = {
  id: number;
  name: string;
  description: string;
  price: string;
}

type MemberData = {
  id: number;
  name: string;
  description: string;
  price: string;
}


type ApiResponse<T> = {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: T[];
};

export default function GymsPage() {
  const [data, setData] = useState<ApiResponse<TransactionData> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<TransactionData | null>(null);
  const [deleteGym, setDeleteGym] = useState<TransactionData | null>(null);
  const { toast } = useToast();

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function getDataConfirmation() {
    try {
      const response = await fetch(`${ApiUrl}/transaction`, {
        headers:{
          "Authorization": `Bearer ${getCookie("token")}`
        }
      })
      const resGym: ApiResponse<TransactionData> = await response.json()
      console.log(resGym);
      setData(resGym)   
    } catch (error) {
      console.log(error);
      
    }
  }

  async function handleConfirmation (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    try {
      await handleConfirmationMember(formData)
      await getDataConfirmation();
      toast({
        title: `Berhasil mengirim data!`,
        description: `${selectedGym?.name} has been ${selectedGym ? "updated" : "added"} to the system.`,
      });
      setIsDialogOpen(false);
      setSelectedGym(null);
    } catch (error) {
      throw error
    }
  };
  
  useEffect(() => {
    getDataConfirmation()
  },[])


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Konfirmasi Membership</h1>
      </div>
      <Card>
        <CardContent className="p-6">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Nama Gym</TableHead>
                <TableHead>Paket Membership</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Bukti Pembayaran</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items ? (
                data?.items.map((data: TransactionData) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.user.name}</TableCell>
                    <TableCell>{data.gym.name}</TableCell>
                    <TableCell>{data.membership_option.name}</TableCell>
                    <TableCell>{formatPrice(data.price)}</TableCell>
                    <TableCell>
                      <Link 
                        href={data.image.image_url}
                        target="_blank"
                      >
                        <Image src={data.image.image_url} className="object-cover" alt="image_transaction" width={200} height={200}/>
                      </Link>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2 text-right">
                      <form onSubmit={handleConfirmation}>
                        <input type="text" name="transaction_id" value={data.id} hidden className="hidden" />
                        <input type="text" name="membership_id" value={data.membership.id} hidden className="hidden"/>
                        <input type="text" name="confirmation" value="success" hidden className="hidden"/>
                        <Button
                          variant="ghost"
                          className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-600 text-white"
                          onClick={() => { 
                            setSelectedGym(data);
                          }}
                        >
                          Setuju
                        </Button>
                      </form>
                      <form onSubmit={handleConfirmation}>
                        <input type="text" name="transaction_id" value={data.id} hidden className="hidden"/>
                        <input type="text" name="membership_id" value={data.membership.id} hidden className="hidden"/>
                        <input type="text" name="confirmation" value="cancel" hidden className="hidden"/>
                        <Button
                          type="submit"
                          variant="ghost"
                          className="py-2.5 px-6 rounded-lg text-sm font-medium bg-red-200 text-red-800"
                          onClick={() => setDeleteGym(data)}
                        >
                          Batalkan
                        </Button>
                      </form>
                      </TableCell>
                  </TableRow>
                ))) :
                <TableRow>
                <TableCell colSpan={6}>Tidak ada data pembayaran</TableCell>
              </TableRow>
                }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}