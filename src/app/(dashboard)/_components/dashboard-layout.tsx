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
        href: "/admin/planner",
        label: "Weekly Plan",
        icon: <Calendar className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Meals",
    items: [
      {
        href: "/admin/meals",
        label: "All Meals",
        icon: <Utensils className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Foods",
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

// -------------- Route Group Component --------------
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

type DashboardLayoutProps = { children: ReactNode };
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div className="bg-background fixed z-10 flex h-13 w-screen items-center justify-between border px-2">
        <Collapsible.Root className="h-full" open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className="m-2" asChild>
            <Button size="icon" variant="outline">
              <Menu />
            </Button>
          </Collapsible.Trigger>
        </Collapsible.Root>
        <div className="flex">
          {/* Theme Toggle */}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                //   variant="ghost"
                className="hover:text-accent-foreground flex h-9 items-center gap-2 px-2"
              >
                <Avatar className="size-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Admin</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
              <Separator />

              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="size-10">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-muted-foreground text-xs">
                    admin@test.com
                  </p>
                </div>
              </div>

              <Separator />

              <DropdownMenuItem
                onClick={() => {
                  // logout
                }}
                variant="destructive"
              >
                <LogOut className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Collapsible.Root
        className="fixed top-0 left-0 z-20 h-dvh"
        open={open}
        onOpenChange={setOpen}
      >
        <Collapsible.Content forceMount>
          <div
            className={`bg-background fixed top-0 left-0 h-screen w-64 border p-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Admin Dashboard</h1>
              <Collapsible.Trigger asChild>
                <Button size="icon" variant="outline">
                  <ChevronLeft />
                </Button>
              </Collapsible.Trigger>
            </div>
            <Separator className="my-2" />
            <div className="mt-4">
              {ROUTE_GROUPS.map((routeGroup) => (
                <RouteGroup {...routeGroup} key={routeGroup.group} />
              ))}
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
      <main
        className={`transition-margin mt-13 flex-1 p-4 duration-300 ${open ? "ml-64" : "ml-0"}`}
      >
        {children}
      </main>
    </div>
  );
}
