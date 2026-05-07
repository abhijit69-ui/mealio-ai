"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Apple,
  Boxes,
  Calendar,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Menu,
  Ruler,
  Utensils,
} from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme-toggle";
import z from "zod";
import { customErrorMap } from "@/lib/customErrorMap";
import { useSignOut } from "@/app/(auth)/sign-in/_services/useSignInMutation";
import { auth } from "@/lib/auth";
import Image from "next/image";

z.setErrorMap(customErrorMap);

type Session = typeof auth.$Infer.Session;

type RouteGroupType = {
  group: string;
  items: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
};

const ROUTE_GROUPS: RouteGroupType[] = [
  {
    group: "Planner",
    items: [
      {
        href: "/client/planner",
        label: "Weekly Plan",
        icon: <Calendar className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Meals",
    items: [
      {
        href: "/client/meals",
        label: "All Meals",
        icon: <Utensils className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Manage Foods",
    items: [
      {
        href: "/admin/foods",
        label: "Foods",
        icon: <Apple className="mr-2 size-3" />,
      },
      {
        href: "/admin/categories",
        label: "Categories",
        icon: <Boxes className="mr-2 size-3" />,
      },
      {
        href: "/admin/serving-units",
        label: "Serving Units",
        icon: <Ruler className="mr-2 size-3" />,
      },
    ],
  },
];

type RouteGroupProps = RouteGroupType;

const RouteGroup = ({ group, items }: RouteGroupProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button
          className="text-foreground/80 flex w-full justify-between font-normal"
          variant="ghost"
        >
          {group}
          <div className={`transition-transform ${open ? "rotate-180" : ""}`}>
            <ChevronDown />
          </div>
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content forceMount>
        <motion.div
          className={`flex flex-col gap-2 ${!open ? "pointer-events-none" : ""}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {items.map((item) => (
            <Button
              className="w-full justify-start font-normal"
              variant="link"
              key={item.href}
            >
              <Link
                className={`flex items-center rounded-md px-5 py-1 transition-all ${
                  pathname === item.href
                    ? "bg-foreground/10 hover:bg-foreground/5"
                    : "hover:bg-foreground/10"
                }`}
                href={item.href}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            </Button>
          ))}
        </motion.div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

type DashboardLayoutProps = { children: ReactNode; session: Session };

export default function DashboardLayout({
  children,
  session,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const signOutMutation = useSignOut();
  const userRole = session.user.role;

  const filteredRouteGroups = ROUTE_GROUPS.filter((group) => {
    if (userRole === "admin") {
      return (
        group.group === "Manage Foods" ||
        group.group === "Planner" ||
        group.group === "Meals"
      );
    } else {
      return group.group === "Planner" || group.group === "Meals";
    }
  });

  return (
    // FIX: overflow-hidden on root prevents any child from causing horizontal scroll
    <div className="flex overflow-hidden">
      {/* Top navbar */}
      <div className="bg-background fixed z-10 flex h-13 w-full items-center justify-between border px-2">
        <Collapsible.Root className="h-full" open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="m-2" asChild>
            <Button size="icon" variant="outline">
              <Menu />
            </Button>
          </Collapsible.Trigger>

          {/* <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Mealio.ai" width={32} height={32} />
            <span className="text-base font-bold tracking-tight">
              Mealio<span className="text-primary">.ai</span>
            </span>
          </Link> */}
        </Collapsible.Root>

        <Link
          href="/"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 select-none"
        >
          {/* Bowl icon from /public/logo.png */}
          <Image
            src="/logo.png"
            alt="Mealio.ai logo"
            width={28}
            height={28}
            className="size-8 object-contain"
          />
          {/* Wordmark — "Mealio" in foreground, ".ai" in primary lime */}
          <span className="pt-1 text-base font-bold tracking-tight">
            Mealio<span className="text-primary">.ai</span>
          </span>
        </Link>

        <div className="flex">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="hover:text-accent-foreground flex h-9 items-center gap-2 px-2">
                <Avatar className="size-8">
                  <AvatarFallback>
                    {session.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{session.user.name}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
              <Separator />
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="size-10">
                  <AvatarFallback>
                    {session.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <Separator />
              <DropdownMenuItem
                onClick={() => signOutMutation.mutate()}
                variant="destructive"
              >
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* FIX: Backdrop overlay — tapping outside closes sidebar on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — always overlays on mobile, never pushes content */}
      <div
        className={`bg-background fixed top-0 left-0 z-20 h-screen w-64 border p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">
            {userRole === "admin" ? "Admin Dashboard" : "Dashboard"}
          </h1>
          <Button size="icon" variant="outline" onClick={() => setOpen(false)}>
            <ChevronLeft />
          </Button>
        </div>
        <Separator className="my-2" />
        <div className="mt-4">
          {filteredRouteGroups.map((routeGroup) => (
            <RouteGroup {...routeGroup} key={routeGroup.group} />
          ))}
        </div>
      </div>

      {/* FIX: main never gets ml-64 on mobile — sidebar overlays instead of pushing */}
      <main className="mt-13 w-full min-w-0 flex-1 p-2 sm:p-4">{children}</main>
    </div>
  );
}
