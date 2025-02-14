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
    facility: [];
    membership_option: PackageData[];
}
type PackageData = {
    id: number;
    name: string;
    description: string;
    features: string;
    price: number;
    gym_id: string;
    user_id: string;
}

type ApiResponse<T> = {
  current_page: string;
  next_page: string | null;
  prev_page: string | null;
  message: string;
  items: GymData;
};

export default function PackagePage() {
  const [data, setData] = useState<ApiResponse<GymData> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [deletePackage, setDeletePackage] = useState<PackageData | null>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const { toast } = useToast();
  const params = useParams()

  const addFeatureInput = () => {
    setFeatures([...features, ""])
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };


  async function getDataPackage() {
    try {
      const response = await fetch(`${ApiUrl}/gym/${params.gymID}`, {
        headers: {
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
    try {
      if (selectedPackage) {
        await editPackage(formData)
      }else{
        await createPackage(formData)
      }
      await getDataPackage();
      toast({
        title: `Gym ${selectedPackage ? "updated" : "created"} successfully!`,
        description: `${formData.get("name")} has been ${selectedPackage ? "updated" : "added"} to the system.`,
      });
      setFeatures([""])
      setIsDialogOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataPackage();
}, []);
  const handleDelete = () => {
    if (!deletePackage) return;

    toast({
      title: "Gym deleted successfully!",
      description: `${deletePackage.name} has been removed from the system.`,
    });

    setDeletePackage(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paket Gym {data?.items?.name}</h1>
        <Dialog open={isDialogOpen} onOpenChange={state => setIsDialogOpen(state)}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPackage ? "Edit" : "Tambah"} Paket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
            <Input
            type="text"
            name="gym_id"
            value={data?.items?.id} 
            className="hidden"
            />
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nama Paket</label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedPackage?.name}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedPackage?.description}
                  required
                />
              </div>
              <div className="grid  gap-4">
              <div className="space-y-2">
                  <label htmlFor="features" className="text-sm font-medium">Fitur</label>
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        name="features"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <Button type="button" onClick={addFeatureInput}>
                    Tambah Fitur
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Harga</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={selectedPackage?.price}
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
                    setSelectedPackage(null);
                  }}
                >
                  Kembali
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
                <TableHead>Nama Paket</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Fitur</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { data?.items.membership_option != undefined  ? (
                data?.items?.membership_option.map((paket: PackageData) => (
                  <TableRow key={paket.id}>
                    <TableCell>{paket.name}</TableCell>
                    <TableCell>{paket.description}</TableCell>
                    <TableCell>
                    {(() => {
                      try {
                        const parsedFeatures = JSON.parse(paket.features);
                        if (Array.isArray(parsedFeatures)) {
                          return (
                            <ul>
                              {parsedFeatures.map((feature, index) => (
                                <li key={index}>- {feature}</li>
                              ))}
                            </ul>
                          );
                        } else {
                          return <span>Fitur tidak ada</span>;
                        }
                      } catch (error) {
                        return <span>Error parsing features</span>;
                      }
                    })()}
                    </TableCell>
                    <TableCell>{formatPrice(paket.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPackage(paket);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletePackage(paket)}
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

      <AlertDialog open={!!deletePackage} onOpenChange={() => setDeletePackage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deletePackage?.name} and remove it from the system.
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