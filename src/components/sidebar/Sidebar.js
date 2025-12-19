"use client";
import Image from "next/image";
import { menuItems } from "@/app/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/authApi";

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
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
                <span className="text-center text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="mb-4 px-3">
        <button
          onClick={logout}
          className="flex w-full flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300 hover:bg-red-50 hover:shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-center text-sm font-medium tracking-wide text-red-600">
            Çıkış Yap
          </span>
        </button>
      </div>
    </aside>
  );
}
