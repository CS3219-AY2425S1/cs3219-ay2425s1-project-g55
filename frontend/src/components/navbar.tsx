import LoginDialog from "@/components/auth/login-dialog";
import { UserMenuAvatar } from "@/components/auth/user-avatar";
import { useAuth } from "@/hooks/auth/useAuth";
import { cn } from "@/lib/utils";
import { CodeXml } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function NavbarLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const pathname = useLocation().pathname;
  return (
    <Link
      to={to}
      className={cn(
        "border-transparent text-muted-foreground  hover:text-foreground inline-flex items-center px-1 pt-2 border-b-2 text-sm font-medium transition h-12",
        pathname === to
          ? "border-primary text-foreground border-b-2"
          : "hover:border-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const auth = useAuth();
  const role = auth?.user?.role || '';

  return (
    <nav className="col-span-12 bg-background h-14">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <CodeXml className="h-8 w-auto text-primary" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavbarLink to="/problems">Problems</NavbarLink>
              <NavbarLink to="/discuss">Discuss</NavbarLink>
              {role == "admin" && (
                <NavbarLink to="/admin/user-management">User Management</NavbarLink>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {auth ? <UserMenuAvatar /> : <LoginDialog />}
          </div>
        </div>
      </div>
    </nav>
  );
}
