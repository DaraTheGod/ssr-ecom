import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart")?.value || "[]";
  let count = 0;
  try {
    const cart = JSON.parse(cartCookie) as { quantity: number }[];
    count = cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {}
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SSR Shop
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <Badge variant="destructive" className="absolute -top-3 -right-5 text-xs">
                {count}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}