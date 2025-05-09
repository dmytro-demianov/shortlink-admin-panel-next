
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  BarChart2, 
  Link as LinkIcon, 
  Folder, 
  Tag, 
  QrCode, 
  Users, 
  Settings, 
  Key
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, to, isActive }: SidebarItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal hover:bg-gray-100/50",
          isActive ? "bg-gray-100 font-medium text-gray-900" : "text-gray-600"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";
  
  const menuItems = [
    { icon: <BarChart2 size={18} />, label: "Dashboard", to: "/" },
    { icon: <LinkIcon size={18} />, label: "Links", to: "/links" },
    { icon: <Folder size={18} />, label: "Folders", to: "/folders" },
    { icon: <Tag size={18} />, label: "Tags", to: "/tags" },
    { icon: <QrCode size={18} />, label: "QR Codes", to: "/qrcodes" },
    { icon: <Key size={18} />, label: "API Keys", to: "/apikeys" }
  ];
  
  const adminItems = [
    { icon: <Users size={18} />, label: "User Management", to: "/users" },
    { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  ];
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm z-20 min-h-screen fixed left-0 top-0 md:relative transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center py-2">
            <LinkIcon className="h-6 w-6 text-brand-600" />
            <span className="ml-2 text-xl font-bold tracking-tight">ShortURL</span>
          </div>
        </div>
        
        <ScrollArea className="flex-1 py-2 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location.pathname === item.to}
              />
            ))}
          </div>
          
          {isAdmin && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Admin</span>
                </div>
              </div>
              
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isActive={location.pathname === item.to}
                  />
                ))}
              </div>
            </>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
