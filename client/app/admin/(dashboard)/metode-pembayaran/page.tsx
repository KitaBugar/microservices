'use client';

import { useEffect, useState } from "react";
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


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { ApiUrl, Url } from "@/config/config";
import { getCookie } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { confirmKTP } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus } from "lucide-react";
import { createMethod, updateMethod } from "@/lib/api/method";

type Image = {
    image: string;
    image_url: string;
}
type MethodData = {
    id: number;
    name: string;
    image: Image;
    phone_number: string;
    identify: string;
}

type ApiResponse= {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: MethodData[];
};

export default function GymsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MethodData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteGym, setDeleteGym] = useState <MethodData | null>(null);
  const { toast } = useToast();



  async function getData() {
    try {
      const response = await fetch(`${ApiUrl}/method`, {
        headers:{
          "Authorization": `Bearer ${getCookie("token")}`
        }
      })
      const resGym: ApiResponse = await response.json()
      setData(resGym)         
  
    } catch (error) {
      console.log(error);
      
    }
  }


  async function handleSave (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let res
    try {
      if (selectedMethod) {
        res = await updateMethod(formData)
      }else{
        res = await createMethod(formData)
      }
      await getData();
      toast({
        title: `${res.message}`,
      });
      setSelectedMethod(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.log(error);
    }
  };

  async function openDialog(state:boolean) {
    setIsDialogOpen(state)
    if (isDialogOpen) {
      setSelectedMethod(null)
    }
  }
  
  useEffect(() => {
    getData()
  },[])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Metode Pembayaran</h1>
      <Dialog open={isDialogOpen} onOpenChange={state => openDialog(state)}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Metode Pembayaran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMethod ? "Edit" : "Add"} Gym</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4" encType="multipart/form-data">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="picture" className="text-sm font-medium">Gambar Metode Pembayaran</label>
                  <Input id="picture" name="image" type="file"/>
                  <Input
                    id="name"
                    name="method_id"
                    defaultValue={selectedMethod?.id ?? "null"}
                    required
                    hidden={true}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nama Tempat</label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedMethod?.name}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedMethod(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Simpan</Button> 
                </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-6">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Metode</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items != undefined ? (
                data?.items.map((data: MethodData) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>
                      <Link href={`${Url}/assets/method/${data?.image?.image}`} target="_blank">
                        <Image src={`${Url}/assets/method/${data?.image?.image}`} alt="image-method" width={200} height={100} className="object-contain w-[200px] h-[200px]"/>
                      </Link>
                    </TableCell>
                    <TableCell className="flex justify-end items-center gap-2 h-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedMethod(data);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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