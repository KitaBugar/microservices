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
import { Plus, Pencil, Trash2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createGym, deletedGym, editGym } from "@/lib/api/gym";
import { ApiUrl } from "@/config/config";
import { getCookie } from "@/lib/utils";
import { number } from "zod";
import Link from "next/link";
import Image from "next/image";
import { REGEXP_ONLY_CHARS } from "input-otp";

type GymData = {
    id: number;
    name: string;
    description: string;
    address: string;
    image: Image[];
    city_id: string;
    province_id: string;
    start_time: string;
    end_time: string;
}
type Image = {
    url: string;
    image_url: string;
}

type ProvinceData = {
    id: string;
    code: string;
    name: string;
}
type RegencyData = {
    id: string;
    code: string;
    name: string;
}

type ApiResponse<T> = {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: T[];
};

export default function GymsPage() {
  const [data, setData] = useState<ApiResponse<GymData> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [regency, setRegency] = useState<ApiResponse<RegencyData> | null>(null);
  const [province, setProvince] = useState<ApiResponse<ProvinceData> | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ApiResponse<ProvinceData> | null>(null);
  const [selectedGym, setSelectedGym] = useState<GymData | null>(null);
  const [deleteGym, setDeleteGym] = useState<GymData | null>(null);
  const { toast } = useToast();

  async function getDataGym() {
    try {
      const response = await fetch(`${ApiUrl}/gym/owner`, {
        headers:{
          "Authorization": `Bearer ${getCookie("token")}`,
        }
      })
      const resGym: ApiResponse<GymData> = await response.json()
      setData(resGym)   
      
    } catch (error) {
      console.log(error);
      
    }
  }

  async function handleSave (e: React.FormEvent<HTMLFormElement>)  {
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
      await getDataGym();
      toast({
        title: `Berhasil menambahkan gym!`,
      });
      setIsDialogOpen(false);
      setSelectedGym(null);
    } catch (error) {
      console.log(error);
    }
  };

  async function getLocation() {
      try {
        const p = await fetch(`${ApiUrl}/province`, {
          headers:{
            "Authorization": `Bearer ${getCookie("token")}`
          }
        })
        const r = await fetch(`${ApiUrl}/regency`, {
          headers:{
            "Authorization": `Bearer ${getCookie("token")}`
          }
        })
        const resRegency: ApiResponse<RegencyData> = await r.json()
        const resProvince: ApiResponse<ProvinceData> = await p.json()
        setRegency(resRegency)   
        setProvince(resProvince)   
        
      } catch (error) {
        console.log(error);
        
      }
  }
  async function openDialog(state:boolean) {
    setIsDialogOpen(state)
    if (isDialogOpen) {
      console.log(selectedGym);
      
      setSelectedGym(null)
    }
  }
  
  useEffect(() => {
    getDataGym()
    getLocation()
  },[])


  const handleDelete = async () => {
    if (!deleteGym) return;
    await deletedGym(deleteGym)
    toast({
      title: "Gym berhasil dihapus!",
      description: `${deleteGym.name} sudah dihapus dari sistem.`,
    });
    setDeleteGym(null);
    getDataGym()
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gyms</h1>
        <Dialog open={isDialogOpen} onOpenChange={state => openDialog(state)}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Gym
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGym ? "Edit" : "Tambah"} Gym</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4" encType="multipart/form-data">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="picture" className="text-sm font-medium">Gambar Tempat</label>
                  <Input id="picture" name="images[]" type="file" multiple/>
                  <Input
                    id="name"
                    name="gym_id"
                    defaultValue={selectedGym?.id ?? "null"}
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
                    defaultValue={selectedGym?.name}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedGym?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="start_time" className="text-sm font-medium">Buka</label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    defaultValue={selectedGym?.start_time}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="end_time" className="text-sm font-medium">Tutup</label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    defaultValue={selectedGym?.end_time}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <label htmlFor="regency" className="text-sm font-medium">Provinsi</label>
                  <Select name="province_id" value={selectedGym?.province_id.toString()}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                          province?.items.map((province: ProvinceData, index) => (
                              <SelectItem key={index} value={province.id.toString()}>{province.name}</SelectItem>
                          ))
                        }
                    </SelectContent>
                  </Select>
                </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="regency" className="text-sm font-medium">Kota/Kabupaten</label>
                  <Select name="city_id" value={selectedGym?.city_id.toString()} 
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Pilih Kota/Kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                          regency?.items.map((regency: RegencyData, index) => (
                            <SelectItem key={index} value={regency.id.toString()}>{regency.name}</SelectItem>
                          ))
                        }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Alamat Tambahan</label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={selectedGym?.address}
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
                    setSelectedGym(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button> 
                </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Search gyms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Tempat</TableHead>
                <TableHead className="w-[500px]">Deskripsi</TableHead>
                <TableHead>Buka</TableHead>
                <TableHead>Tutup</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Detail Paket</TableHead>
                <TableHead>Check-in Membership</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items != undefined ? (
                data?.items.map((gym: GymData) => (
                  <TableRow key={gym.id}>
                    <TableCell>
                      {
                        (gym?.image != undefined) ? (
                          <Image
                          src={gym?.image[0].image_url}
                          width={70}
                          height={70}
                          alt="image gym"
                          />
                        ) : ""
                      }
                    
                    </TableCell>
                    <TableCell>{gym.name}</TableCell>
                    <TableCell>{gym.description}</TableCell>
                    <TableCell>{gym.start_time}</TableCell>
                    <TableCell>{gym.end_time}</TableCell>
                    <TableCell>{gym.address}</TableCell>
                    <TableCell>
                    <Link
                      href={`/gyms/${gym.id}`}
                      className="bg-gray-800 text-white p-2.5 rounded-lg"
                    >
                      Detail Paket
                    </Link>
                    </TableCell>
                    <TableCell>
                    <Link
                      href={`/gyms/${gym.id}/check`}
                      className="bg-blue-800 text-white p-2.5 rounded-lg"
                    >
                      Check-in Membership
                    </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedGym(gym);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteGym(gym)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))) :
                <TableRow>
                <TableCell colSpan={6}>Tidak ada data gym</TableCell>
              </TableRow>
                }
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteGym} onOpenChange={() => setDeleteGym(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa mengembalikan data yang dihapus. Ini akan menghapus {" "}
              {deleteGym?.name} secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}