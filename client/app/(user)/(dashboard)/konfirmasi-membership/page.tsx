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

const Dialog = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.Dialog));
const DialogContent = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogContent));
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogHeader));
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogTitle));
const DialogTrigger = dynamic(() => import('@/components/ui/dialog').then((mod) => mod.DialogTrigger));

import { useToast } from "@/hooks/use-toast";
import { createGym, editGym } from "@/lib/api/gym";
import { ApiUrl } from "@/config/config";
import { formatPrice, getCookie } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

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
    membership_option: MemberData;
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
      setData(resGym)   
      console.log(resGym);
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

  async function handleConfirmation (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }
    try {
      if (selectedGym) {
        await editGym(formData)
      }else{
        await createGym(formData)
      }
      await getDataConfirmation();
      toast({
        title: `Gym ${selectedGym ? "updated" : "created"} successfully!`,
        description: `${formData.get("name")} has been ${selectedGym ? "updated" : "added"} to the system.`,
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


  const handleDelete = () => {
    if (!deleteGym) return;

    toast({
      title: "Gym deleted successfully!",
      description: `${deleteGym.name} has been removed from the system.`,
    });

    setDeleteGym(null);
  };

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
              { data?.items != undefined ? (
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
                      <Button
                        variant="ghost"
                        className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-600 text-white"
                        onClick={() => {
                          setSelectedGym(data);
                          setIsDialogOpen(true);
                        }}
                      >
                        Setuju
                      </Button>
                      <Button
                        variant="ghost"
                        className="py-2.5 px-6 rounded-lg text-sm font-medium bg-red-200 text-red-800"
                        onClick={() => setDeleteGym(data)}
                      >
                        Batalkan
                      </Button>
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