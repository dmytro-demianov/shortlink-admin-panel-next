
import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout = ({ 
  children, 
  title, 
  description 
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center justify-center">
              <LinkIcon className="h-10 w-10 text-brand-600" />
              <span className="ml-2 text-2xl font-bold tracking-tight">
                ShortURL
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}
          </div>

          <div className="mt-10">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-brand-600 to-brand-800">
          <div className="p-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to ShortURL</h1>
            <p className="text-xl mb-8">Powerful URL shortening and analytics platform</p>
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Track Link Performance</h3>
                <p className="text-sm text-white/80">
                  Monitor clicks, track geographic data, and analyze referrers
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Organize with Folders</h3>
                <p className="text-sm text-white/80">
                  Manage links efficiently with custom folders and tags
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">QR Code Integration</h3>
                <p className="text-sm text-white/80">
                  Generate QR codes for your short links instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
