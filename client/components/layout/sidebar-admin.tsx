'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DumbbellIcon, HomeIcon, BuildingIcon, Dumbbell, CreditCard, Folder, User, LogOut, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/admin',
  },
  {
    label: 'Fasilitas',
    icon: DumbbellIcon,
    href: '/admin/fasilitas',
  },
  {
    label: 'Metode Pembayaran',
    icon: CreditCard,
    href: '/admin/metode-pembayaran',
  },
  {
    label: 'Konfirmasi KTP',
    icon: UserRoundCheck,
    href: '/admin/konfirmasi-ktp',
  },
  {
    label: 'Logout',
    icon: LogOut,
    href: '/admin/logout',
  },
];

export function SidebarAdmin() {
  const pathname = usePathname();
  
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-blue-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold ml-2">Admin Panel</h1>
        </Link>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href ? "bg-white/10" : "hover:bg-white/10"
                )}
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}