import { Link, Outlet } from "react-router-dom";
import {
  Menu,
  Bell,
  Home,
  Users,
  Search,
  Package2,
  Package,
  LineChart,
  CircleUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    // Perform any necessary cleanup or backend requests
    // Redirect to the login page
    logout();
  };
  const linkClass = (path: string) => {
    const isActive = location.pathname.endsWith(path);
    return `flex items-center gap-3 rounded-lg px-3 py-2 ${
      isActive ? "text-primary bg-muted" : "text-muted-foreground"
    } transition-all hover:text-primary`;
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 ">
          <div className="flex h-14 items-center  border-b px-4 lg:h-[60px] fixed lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Tax Stream</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 ">
            {/* Desktop Navigation Menu */}
            <nav className="grid top-20 fixed items-start px-2 font-medium lg:px-4">
              <Link to="/dashboard" className={linkClass("dashboard")}>
                <Home className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                to="policy-settings"
                className={linkClass("policy-settings")}
              >
                <Package className="h-4 w-4" />
                Policy Settings
              </Link>
              <Link
                to="staff-enrollment"
                className={linkClass("staff-enrollment")}
              >
                <Package className="h-4 w-4" />
                Staff Enrollment
              </Link>
              <Link
                to="payee-enrollment"
                className={linkClass("payee-enrollment")}
              >
                <Package className="h-4 w-4" />
                Payee Enrollment
              </Link>
              <Link to="audit" className={linkClass("audit")}>
                <Users className="h-4 w-4" />
                Audit
              </Link>
              <Link to="assessment" className={linkClass("assessment")}>
                <Users className="h-4 w-4" />
                Assesment
              </Link>
              <Link to="profile" className={linkClass("profile")}>
                <Users className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                <AlertDialog>
                  <AlertDialogTrigger className="">Logout </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to log out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        By logging out, you'll be signed out of your account and
                        will need to log in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Button type="submit" onClick={handleLogout}>
                          Logout
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex sticky z-20 top-0 bg-white backdrop-blur-lg h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              {/* Mobile Menu */}
              <nav className="grid gap-2 text-lg font-medium">
                <Link to="/" className={linkClass("dashboard")}>
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Tax Stream</span>
                </Link>
                <Link to="/dashboard" className={linkClass("dashboard")}>
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  to="policy-settings"
                  className={linkClass("policy-settings")}
                >
                  <LineChart className="h-5 w-5" />
                  Policy Settings
                </Link>
                <Link
                  to="staff-enrollment"
                  className={linkClass("staff-enrollment")}
                >
                  <LineChart className="h-5 w-5" />
                  Staff Enrollment
                </Link>
                <Link
                  to="payee-enrollment"
                  className={linkClass("payee-enrollment")}
                >
                  <Package className="h-4 w-4" />
                  Payee Enrollment
                </Link>
                <Link to="audit" className={linkClass("audit")}>
                  <LineChart className="h-5 w-5" />
                  Audit
                </Link>
                <Link to="assessment" className={linkClass("assessment")}>
                  <LineChart className="h-5 w-5" />
                  Assesment
                </Link>
                <Link to="#" className={linkClass("#")}>
                  <LineChart className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  <AlertDialog>
                    <AlertDialogTrigger className="">
                      Logout{" "}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to log out?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          By logging out, you'll be signed out of your account
                          and will need to log in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>
                          <Button type="submit" onClick={handleLogout}>
                            Logout
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* Component Rendered based on Link clicked  */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
