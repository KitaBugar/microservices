'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, facilities, gyms, testimonials } from "@/lib/data";
import { Building2, Dumbbell, Users, CreditCard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Selamat Datang!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Semoga harimu menyenangkan!</CardTitle>
            {/* <Building2 className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{`${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()} `}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {testimonials.slice(0, 5).map(testimonial => (
            <Card key={testimonial.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{testimonial.userName}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.comment}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}