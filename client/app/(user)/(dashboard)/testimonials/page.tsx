'use client';

import { useState } from "react";
import { testimonials } from "@/lib/data";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TestimonialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null);
  const [deleteTestimonial, setDeleteTestimonial] = useState<typeof testimonials[0] | null>(null);
  const { toast } = useToast();

  const filteredTestimonials = (testimonials || []).filter((testimonial) =>
    testimonial.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const testimonialData = {
      id: selectedTestimonial?.id || String(testimonials.length + 1),
      userName: formData.get("name") as string,
      avatar: formData.get("avatar") as string,
      occupation: formData.get("occupation") as string,
      rating: Number(formData.get("rating")),
      content: formData.get("content") as string,
      gym_name: formData.get("gym_name") as string,
    };

    toast({
      title: `Testimonial ${selectedTestimonial ? "updated" : "created"} successfully!`,
      description: `Testimonial by ${testimonialData.userName} has been ${selectedTestimonial ? "updated" : "added"} to the system.`,
    });

    setIsDialogOpen(false);
    setSelectedTestimonial(null);
  };

  const handleDelete = () => {
    if (!deleteTestimonial) return;

    toast({
      title: "Testimonial deleted successfully!",
      description: `Testimonial by ${deleteTestimonial.userName} has been removed from the system.`,
    });

    setDeleteTestimonial(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTestimonial ? "Edit" : "Add"} Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedTestimonial?.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="occupation" className="text-sm font-medium">Occupation</label>
                  <Input
                    id="occupation"
                    name="occupation"
                    defaultValue={selectedTestimonial?.occupation}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium">Avatar URL</label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="url"
                  defaultValue={selectedTestimonial?.avatar}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gym_name" className="text-sm font-medium">Gym Name</label>
                <Input
                  id="gym_name"
                  name="gym_name"
                  defaultValue={selectedTestimonial?.gym_name}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                  <Select 
                    name="rating" 
                    defaultValue={selectedTestimonial?.rating.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">Testimonial Content</label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={selectedTestimonial?.content}
                  required
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedTestimonial(null);
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
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gym</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                 className="h-10 w-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{testimonial.name}</TableCell>
                  <TableCell>{testimonial.gym_name}</TableCell>
                  <TableCell>{testimonial.rating} Star{testimonial.rating > 1 ? 's' : ''}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTestimonial(testimonial);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTestimonial(testimonial)}
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

      <AlertDialog open={!!deleteTestimonial} onOpenChange={() => setDeleteTestimonial(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deleteTestimonial?.name} and remove it from the system.
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