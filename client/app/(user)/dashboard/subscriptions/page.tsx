'use client';
import Image from 'next/image'
import { useState } from "react";
import { subscriptions } from "@/lib/data";
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
import { Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";

// Definisikan tipe yang sesuai dengan struktur database
interface Subscription {
  booking_trx_id: string;
  name: string;
  phone: string;
  email: string;
  proof: string;
  total_amount: number;
  duration: string;
  is_paid: boolean;
  starter_at: string;
  ended_at: string;
  subscribe_package_id: string;
}

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [deleteSubscription, setDeleteSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  // Filter subscriptions berdasarkan nama atau email
  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatter untuk mata uang Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formatter untuk tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    if (!deleteSubscription) return;

    toast({
      title: "Subscription deleted successfully!",
      description: `Subscription for ${deleteSubscription.name} has been removed from the system.`,
    });

    setDeleteSubscription(null);
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaksi ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Biaya</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status Pembayaran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>{sub.booking_trx_id}</TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{formatRupiah(sub.total_amount)}</TableCell>
                  <TableCell>{sub.duration}</TableCell>
                  <TableCell>
                    <Badge variant={sub.is_paid ? "default" : "destructive"}>
                      {sub.is_paid ? "Lunas" : "Belum Lunas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewDetails(sub)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteSubscription(sub)}
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

      {/* Dialog Detail Subscription */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Subscription</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nama</p>
                <p>{selectedSubscription.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{selectedSubscription.email}</p>
              </div>
              <div>
                <p className="font-semibold">No Telepon</p>
                <p>{selectedSubscription.phone}</p>
              </div>
              <div>
                <p className="font-semibold">Transaksi ID</p>
                <p>{selectedSubscription.booking_trx_id}</p>
              </div>
              <div>
                <p className="font-semibold">Total Biaya</p>
                <p>{formatRupiah(selectedSubscription.total_amount)}</p>
              </div>
              <div>
                <p className="font-semibold">Durasi</p>
                <p>{selectedSubscription.duration}</p>
              </div>
              <div>
                <p className="font-semibold">Mulai Berlangganan</p>
                <p>{formatDate(selectedSubscription.starter_at)}</p>
              </div>
              <div>
                <p className="font-semibold">Berakhir Berlangganan</p>
                <p>{formatDate(selectedSubscription.ended_at)}</p>
              </div>
              <div>
                <p className="font-semibold">Status Pembayaran</p>
                <Badge variant={selectedSubscription.is_paid ? "default" : "destructive"}>
                  {selectedSubscription.is_paid ? "Lunas" : "Belum Lunas"}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Bukti Pembayaran</p>
                <Image src={selectedSubscription.proof} alt="Proof of Payment" className="w-full h-auto rounded"/>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteSubscription} onOpenChange={() => setDeleteSubscription(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus subscription untuk {deleteSubscription?.name}? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteSubscription(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}