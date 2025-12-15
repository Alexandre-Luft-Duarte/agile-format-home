import { useEffect } from "react";
import FinancialCard from "@/components/FinancialCard";
import EventCard from "@/components/EventCard";
import CommunicationsSection from "@/components/CommunicationsSection";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import eventPlaceholder from "@/assets/event-placeholder.jpg";

const Index = () => {
  const { user } = useAuth();
  const studentName = user?.user_metadata?.full_name || "Usuário";

  useEffect(() => {
    document.title = "Início - Formae";
  }, []);

  // Mock data for screenshots
  const nextInstallment = "R$ 300,00";
  const outstandingBalance = "R$ 3.300,00";
  const nextEvent = {
    name: "Festa de 100 Dias",
    date: "15 de Janeiro",
    image: eventPlaceholder,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-3xl font-bold mb-1">Olá, {studentName}!</h1>
          <p className="text-primary-foreground/90 text-sm">
            Bem-vindo ao Formae
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
