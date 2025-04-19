import { useLocation, Link } from "wouter";
import { Home, BarChart2, Calendar, Settings } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const menuItems = [
    {
      name: "Overview",
      href: "/",
      icon: Home,
    },
    {
      name: "Feedback Management",
      href: "/feedback-management",
      icon: Calendar,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
  
  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Admin Panel</h2>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a
                className={`${
                  isActive(item.href)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive(item.href) ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 h-6 w-6`}
                />
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
