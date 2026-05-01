"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Boxes, Ruler } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const getDefaultTab = () => {
    if (pathname.includes("/admin/categories")) return "categories";
    if (pathname.includes("/admin/serving-units")) return "serving-units";
    return "foods";
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      foods: "/admin/foods",
      categories: "/admin/categories",
      "serving-units": "/admin/serving-units",
    };
    router.push(routes[value]);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Tabs value={getDefaultTab()} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="foods" className="flex items-center gap-2">
              <Apple className="size-4" />
              Foods
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Boxes className="size-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="serving-units"
              className="flex items-center gap-2"
            >
              <Ruler className="size-4" />
              Serving Units
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
};

export default Layout;
