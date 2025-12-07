"use client";
import Image from "next/image";
import { menuItems } from "@/app/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-34 mt-2 flex min-h-screen flex-col font-[parkinsans]">
      {/* Logo */}
      <div className="mb-8 mt-3 flex items-center justify-center">
        <div className="rounded-xl bg-white p-3.5 shadow-sm">
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
        <div className="flex flex-col items-center justify-center space-y-3 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex w-full flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/50 hover:shadow-sm"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={25}
                  height={25}
                  aria-hidden="true"
                />
                <span className="text-center text-sm font-medium text-gray-700 tracking-wid ">
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
