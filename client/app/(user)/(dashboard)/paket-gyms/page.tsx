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
import { createGym, editGym } from "@/lib/api/gym";
import { ApiUrl } from "@/config/config";
import { getCookie } from "@/lib/utils";
import { number } from "zod";

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
  const [facilityQuery, setFacilityQuery] = useState(null);
  const [regency, setRegency] = useState<ApiResponse<RegencyData> | null>(null);
  const [province, setProvince] = useState<ApiResponse<ProvinceData> | null>(null);
  const [selectedGym, setSelectedGym] = useState<GymData | null>(null);
  const [deleteGym, setDeleteGym] = useState<GymData | null>(null);
  const { toast } = useToast();

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function getDataGym() {
    try {
      const response = await fetch(`${ApiUrl}/gym`, {
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
        title: `Gym ${selectedGym ? "updated" : "created"} successfully!`,
        description: `${formData.get("name")} has been ${selectedGym ? "updated" : "added"} to the system.`,
      });
      setIsDialogOpen(false);
      setSelectedGym(null);
    } catch (error) {
      console.log(error);
    }
  };
  async function handleEdit (e: React.FormEvent<HTMLFormElement>)  {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }
    
    try {
      await createGym(formData)
      await getDataGym();
      toast({
        title: `Gym ${selectedGym ? "updated" : "created"} successfully!`,
        description: `${formData.get("name")} has been ${selectedGym ? "updated" : "added"} to the system.`,
      });
      setIsDialogOpen(false);
      setSelectedGym(null);
    } catch (error) {
      console.log(error);
    }
  };

  async function getLocation(state:boolean) {
    if (state) {
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
    setIsDialogOpen(state)
  }
  
  useEffect(() => {
    getDataGym()
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
        <h1 className="text-3xl font-bold">Gyms</h1>
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
                <TableHead>Deskripsi</TableHead>
                <TableHead>Buka</TableHead>
                <TableHead>Tutup</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items != undefined ? (
                data?.items.map((gym: GymData) => (
                  <TableRow key={gym.id}>
                    <TableCell>
                      {gym.images}
                    </TableCell>
                    <TableCell>{gym.name}</TableCell>
                    <TableCell>{gym.description}</TableCell>
                    <TableCell>{gym.start_time}</TableCell>
                    <TableCell>{gym.end_time}</TableCell>
                    <TableCell>{gym.address}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedGym(gym);
                          setIsDialogOpen(true);
                        }}
                      >
                        Detail Paket
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
    </div>
  );
}