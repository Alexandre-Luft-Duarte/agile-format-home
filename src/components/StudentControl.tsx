import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { CreateChargeDialog } from "./CreateChargeDialog";

interface Student {
  id: string;
  full_name: string;
  status: "paid" | "overdue";
}

const StudentControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateCharge, setShowCreateCharge] = useState(false);

  // Mock data for screenshots
  const [students] = useState<Student[]>([
    { id: "1", full_name: "João Silva", status: "paid" },
    { id: "2", full_name: "Maria Santos", status: "paid" },
    { id: "3", full_name: "Pedro Oliveira", status: "overdue" },
    { id: "4", full_name: "Ana Costa", status: "paid" },
    { id: "5", full_name: "Lucas Ferreira", status: "overdue" },
    { id: "6", full_name: "Juliana Lima", status: "paid" },
    { id: "7", full_name: "Rafael Souza", status: "paid" },
    { id: "8", full_name: "Camila Rodrigues", status: "overdue" },
  ]);

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChargeCreated = () => {
    // Mock function
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Action Button */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowCreateCharge(true)} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado ainda"}
          </CardContent>
        </Card>
      ) : (
        filteredStudents.map((student) => (
          <Card key={student.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{student.full_name}</p>
                <Badge
                  variant={student.status === "paid" ? "default" : "destructive"}
                  className={
                    student.status === "paid"
                      ? "bg-accent/20 text-accent-foreground hover:bg-accent/30"
                      : ""
                  }
                >
                  {student.status === "paid" ? "Em dia" : "Atrasado"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <CreateChargeDialog
        open={showCreateCharge}
        onOpenChange={setShowCreateCharge}
        onChargeCreated={handleChargeCreated}
      />
    </div>
  );
};

export default StudentControl;
