import { useEffect } from "react";
import FinancialCard from "@/components/FinancialCard";
import EventCard from "@/components/EventCard";
import CommunicationsSection from "@/components/CommunicationsSection";
import BottomNavigation from "@/components/BottomNavigation";
import eventImage from "@/assets/event-100-days.jpg";

const Index = () => {
  useEffect(() => {
    document.title = "Início - Forma Ágil";
  }, []);
  // Mock data - in a real app, this would come from an API or context
  const studentName = "Maria Silva";
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
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-elevated">
        <div className="max-w-md mx-auto">
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
