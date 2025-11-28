import { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Lock, 
  Bell, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  Copy
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
  const { user, signOut, userRole } = useAuth();
  const studentName = user?.user_metadata?.full_name || "Usuário";
  const [classInfo, setClassInfo] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    document.title = "Meu Perfil - Formae";
    
    // Fetch class info for admin users
    const fetchClassInfo = async () => {
      console.log('🔍 Debug - userRole:', userRole);
      console.log('🔍 Debug - user:', user);
      
      if (!user || userRole !== 'admin') {
        console.log('❌ Não é admin ou não tem usuário');
        return;
      }
      
      console.log('✅ Usuário é admin, buscando profile...');
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('class_id')
        .eq('id', user.id)
        .single();
      
      console.log('📋 Profile data:', profile);
      console.log('📋 Profile error:', profileError);
      
      if (profile?.class_id) {
        console.log('✅ class_id encontrado:', profile.class_id);
        
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('name, code')
          .eq('id', profile.class_id)
          .single();
        
        console.log('🏫 Class data:', classData);
        console.log('🏫 Class error:', classError);
        
        if (classData) {
          setClassInfo(classData);
          console.log('✅ classInfo setado:', classData);
        }
      } else {
        console.log('❌ class_id não encontrado no profile');
      }
    };
    
    fetchClassInfo();
  }, [user, userRole]);

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

  const handleLogout = async () => {
    await signOut();
    toast.success("Até logo!");
  };

  const handleCopyCode = () => {
    if (classInfo?.code) {
      navigator.clipboard.writeText(classInfo.code);
      toast.success("Código copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
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
              <p className="text-white/90 text-sm">{classInfo?.name || "Turma 2024"}</p>
            </div>
          </div>
        </div>

        {/* Class Code Section (Admin Only) */}
        {userRole === 'admin' && classInfo && (
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Código da Turma
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Compartilhe este código com os alunos para que possam se cadastrar na turma
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-accent/10 rounded-lg px-4 py-3">
                <p className="text-2xl font-bold text-primary tracking-wider">
                  {classInfo.code}
                </p>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="icon"
                className="h-12 w-12"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

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
