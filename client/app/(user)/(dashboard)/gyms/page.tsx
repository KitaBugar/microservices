'use client';

import { useState } from "react";
import { gyms } from "@/lib/data";
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
import { Textarea } from "@/components/ui/textarea";

export default function GymsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<typeof gyms[0] | null>(null);
  const [deleteGym, setDeleteGym] = useState<typeof gyms[0] | null>(null);
  const { toast } = useToast();

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gymData = {
      id: selectedGym?.id || String(gyms.length + 1),
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      thumbnail: formData.get("thumbnail") as string,
      description: formData.get("description") as string,
      about: formData.get("about") as string,
      is_popular: formData.get("is_popular") === "on",
      open_time: formData.get("open_time") as string,
      close_time: formData.get("close_time") as string,
      facilities: (formData.get("facilities") as string).split(',').map(f => f.trim()),
      images: selectedGym?.images || [], // In a real app, handle image uploads
    };

    toast({
      title: `Gym ${selectedGym ? "updated" : "created"} successfully!`,
      description: `${gymData.name} has been ${selectedGym ? "updated" : "added"} to the system.`,
    });

    setIsDialogOpen(false);
    setSelectedGym(null);
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Gym
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGym ? "Edit" : "Add"} Gym</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedGym?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={selectedGym?.city}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={selectedGym?.address}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-medium">Thumbnail URL</label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  defaultValue={selectedGym?.thumbnail}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedGym?.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="about" className="text-sm font-medium">About</label>
                <Textarea
                  id="about"
                  name="about"
                  defaultValue={selectedGym?.about}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="open_time" className="text-sm font-medium">Open Time</label>
                  <Input
                    id="open_time"
                    name="open_time"
                    type="time"
                    defaultValue={selectedGym?.open_time}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="close_time" className="text-sm font-medium">Close Time</label>
                  <Input
                    id="close_time"
                    name="close_time"
                    type="time"
                    defaultValue={selectedGym?.close_time}
                    required
                  />
                </div>
                <div className="space-y-2 flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="is_popular"
                    name="is_popular"
                    defaultChecked={selectedGym?.is_popular}
                    className="mr-2"
                  />
                  <label htmlFor="is_popular" className="text-sm font-medium">Popular Gym</label>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="facilities" className="text-sm font-medium">Facilities (comma-separated)</label>
                <Input
                  id="facilities"
                  name="facilities"
                  defaultValue={selectedGym?.facilities.join(', ')}
                  required
                />
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
                <Button type="submit">Save</Button> </div>
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
                <TableHead>Thumbnail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGyms.map((gym) => (
                <TableRow key={gym.id}>
                  <TableCell>
                    <img
                      src={gym.thumbnail}
                      alt={gym.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{gym.name}</TableCell>
                  <TableCell>{gym.city}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteGym} onOpenChange={() => setDeleteGym(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deleteGym?.name} and remove it from the system.
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