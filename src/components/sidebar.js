"use client";
import Image from "next/image";
import { menuItems } from "@/app/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-32 p-2 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex justify-center items-center mt-3 mb-8">
        <div className="bg-white rounded-xl p-2">
          <Image
            className="rounded-xl"
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="flex flex-col justify-center items-center space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-2 w-full p-2 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-white" : "hover:bg-white/50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Image
                  src={item.icon}
                  className="rounded-xl"
                  alt=""
                  width={25}
                  height={25}
                  aria-hidden="true"
                />
                <span className="text-sm text-center text-gray-800 font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
