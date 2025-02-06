'use client';

import { useState } from "react";
import { subscriptionPackages } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Definisikan tipe yang sesuai dengan struktur database
interface SubscriptionPackage {
  icon: string;
  name: string;
  price: number;
  duration: string;
}

export default function SubscriptionPackagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [deletePackage, setDeletePackage] = useState<SubscriptionPackage | null>(null);
  const { toast } = useToast();

  // Filter packages berdasarkan nama
  const filteredPackages = subscriptionPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const packageData: SubscriptionPackage = {
      icon: formData.get("icon") as string,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      duration: formData.get("duration") as string
    };

    // Logika penyimpanan (bisa diganti dengan API call)
    toast({
      title: `Package ${selectedPackage ? "updated" : "created"} successfully!`,
      description: `${packageData.name} package has been ${selectedPackage ? "updated" : "added"} to the system.`,
    });

    setIsDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleDelete = () => {
    if (!deletePackage) return;

    toast({
      title: "Package deleted successfully!",
      description: `${deletePackage.name} package has been removed from the system.`,
    });

    setDeletePackage(null);
  };

  // Formatter untuk mata uang Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscription Packages</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPackage ? "Edit" : "Add"} Package</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Package Name</label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedPackage?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="icon" className="text-sm font-medium">Icon URL</label>
                  <Input
                    id="icon"
                    name="icon"
                    type="url"
                    defaultValue={selectedPackage?.icon}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Price (Rp)</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={selectedPackage?.price}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">Duration</label>
                  <Select 
                    name="duration" 
                    defaultValue={selectedPackage?.duration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Bulanan', 'Triwulan', 'Tahunan'].map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              placeholder="Cari paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={pkg.icon}
                      alt={pkg.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>{formatRupiah(pkg.price)}</TableCell>
                  <TableCell>{pkg.duration}</TableCell>
                   <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeletePackage(pkg)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletePackage} onOpenChange={() => setDeletePackage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus paket "{deletePackage?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletePackage(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}