import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Lock, 
  Bell, 
  HelpCircle, 
  ChevronRight,
  LogOut 
} from "lucide-react";
import { toast } from "sonner";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const MenuItem = ({ icon: Icon, label, onClick }: MenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-accent/10 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
};

const Perfil = () => {
  const [studentName] = useState("Ana Silva");
  const [studentClass] = useState("Turma 2025 - Engenharia");

  useEffect(() => {
    document.title = "Meu Perfil - Forma Ágil";
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuClick = (option: string) => {
    toast.info(`Abrindo ${option}...`);
  };

  const handleLogout = () => {
    toast.success("Saindo da conta...");
    // Logout logic will be implemented when authentication is added
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Meu Perfil
        </h1>

        {/* Profile Header */}
        <div className="bg-gradient-primary rounded-2xl p-6 mb-6 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
                {getInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {studentName}
              </h2>
              <p className="text-white/90 text-sm">{studentClass}</p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6">
          <MenuItem
            icon={User}
            label="Meus Dados Pessoais"
            onClick={() => handleMenuClick("Meus Dados Pessoais")}
          />
          <Separator />
          <MenuItem
            icon={Lock}
            label="Alterar Senha"
            onClick={() => handleMenuClick("Alterar Senha")}
          />
          <Separator />
          <MenuItem
            icon={Bell}
            label="Notificações"
            onClick={() => handleMenuClick("Notificações")}
          />
          <Separator />
          <MenuItem
            icon={HelpCircle}
            label="Ajuda & Suporte"
            onClick={() => handleMenuClick("Ajuda & Suporte")}
          />
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="lg"
          className="w-full gap-2 shadow-card"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Perfil;
