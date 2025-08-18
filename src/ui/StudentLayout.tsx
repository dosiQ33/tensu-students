import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, User, ChevronLeft } from "lucide-react";

type StudentLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
};

const TABS = [
  { label: "Home", path: "/home", Icon: Home },
  { label: "Schedule", path: "/schedule", Icon: Calendar },
  { label: "Clubs", path: "/clubs", Icon: Users },
  { label: "Profile", path: "/profile", Icon: User },
] as const;

export default function StudentLayout({
  children,
  title,
  subtitle,
  showBack = false,
  rightSlot,
}: StudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {title && (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {showBack && (
                  <button
                    aria-label="Back"
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                  )}
                </div>
              </div>
              {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 pb-28">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-gray-100">
        <div className="grid grid-cols-4">
          {TABS.map(({ label, path, Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                disabled={active}
                className={`relative py-2.5 flex flex-col items-center gap-1 transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[11px] ${active ? "font-medium" : ""}`}>{label}</span>
                {active && (
                  <span className="absolute top-0 h-1 w-10 bg-blue-600 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* iOS safe-area */}
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </nav>
    </div>
  );
}


