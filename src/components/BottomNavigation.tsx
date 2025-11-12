import { Home, Wallet, Calendar, User } from "lucide-react";
import { NavLink } from "./NavLink";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Início", icon: Home, href: "/" },
  { id: "finances", label: "Finanças", icon: Wallet, href: "/financas" },
  { id: "events", label: "Eventos", icon: Calendar, href: "/eventos" },
  { id: "profile", label: "Perfil", icon: User, href: "/perfil" },
];

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors"
                activeClassName="text-primary bg-primary/10"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
