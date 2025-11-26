import { useEffect, useState } from "react";
import FinancialCard from "@/components/FinancialCard";
import EventCard from "@/components/EventCard";
import CommunicationsSection from "@/components/CommunicationsSection";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import eventImage from "@/assets/event-100-days.jpg";

const Index = () => {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState<string>("Usuário");

  useEffect(() => {
    document.title = "Início - Forma Ágil";
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setStudentName(data.full_name);
      }
    };

    fetchUserProfile();
  }, [user]);
  const nextInstallment = "R$ 300,00";
  const outstandingBalance = "R$ 3.300,00";
  const nextEvent = {
    name: "Festa de 100 Dias",
    date: "25 de Março",
    image: eventImage,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-1">Olá, {studentName}!</h1>
          <p className="text-primary-foreground/90 text-sm">
            Bem-vindo ao Forma Ágil
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Financial Card */}
        <FinancialCard
          nextInstallment={nextInstallment}
          outstandingBalance={outstandingBalance}
        />

        {/* Event Card */}
        <EventCard
          eventName={nextEvent.name}
          eventDate={nextEvent.date}
          eventImage={nextEvent.image}
        />

        {/* Communications Section */}
        <CommunicationsSection />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
