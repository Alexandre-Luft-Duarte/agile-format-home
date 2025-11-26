import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  full_name: string;
  status: "paid" | "overdue";
}

const StudentControl = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name");

    if (profiles) {
      const studentsWithStatus = await Promise.all(
        profiles.map(async (profile) => {
          const { data: installments } = await supabase
            .from("student_installments")
            .select("status")
            .eq("student_id", profile.id);

          const hasOverdue = installments?.some((i) => i.status === "overdue");
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            status: hasOverdue ? "overdue" : "paid",
          } as Student;
        })
      );

      setStudents(studentsWithStatus);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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
    </div>
  );
};

export default StudentControl;
