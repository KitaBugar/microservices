'use client';

import { useState } from "react";
import { cities } from "@/lib/data";
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

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<typeof cities[0] | null>(null);
  const [deleteCity, setDeleteCity] = useState<typeof cities[0] | null>(null);
  const { toast } = useToast();

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cityData = {
      id: selectedCity?.id || String(cities.length + 1),
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      image: formData.get("image") as string,
    };

    // In a real app, this would be an API call
    toast({
      title: `City ${selectedCity ? "updated" : "created"} successfully!`,
      description: `${cityData.name} has been ${selectedCity ? "updated" : "added"} to the system.`,
    });

    setIsDialogOpen(false);
    setSelectedCity(null);
  };

  const handleDelete = () => {
    if (!deleteCity) return;

    // In a real app, this would be an API call
    toast({
      title: "City deleted successfully!",
      description: `${deleteCity.name} has been removed from the system.`,
    });

    setDeleteCity(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cities</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCity ? "Edit" : "Add"} City</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedCity?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={selectedCity?.slug}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={selectedCity?.image}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedCity(null);
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
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCities.map((city) => (
                <TableRow key={city.id}>
                  <TableCell>
                    <img
                      src={city.image}
                      alt={city.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteCity(city)}
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

      <AlertDialog open={!!deleteCity} onOpenChange={() => setDeleteCity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deleteCity?.name} and remove it from the system.
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