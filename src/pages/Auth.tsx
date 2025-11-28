import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classOption, setClassOption] = useState<"create" | "join">("join");
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const { signIn, signUp, user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Formae";
  }, []);

  useEffect(() => {
    if (user && userRole) {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || (!isLogin && !fullName)) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate class fields for signup
    if (!isLogin) {
      if (selectedRole === "admin" && classOption === "create" && !className) {
        toast({
          title: "Erro",
          description: "Por favor, informe o nome da turma",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if ((selectedRole === "student" || classOption === "join") && !classCode) {
        toast({
          title: "Erro",
          description: "Por favor, informe o código da turma",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
      }
    } else {
      const { error } = await signUp(
        email, 
        password, 
        fullName, 
        selectedRole,
        classOption === "join" ? classCode : undefined,
        classOption === "create" ? className : undefined
      );
      if (error) {
        toast({
          title: "Erro ao cadastrar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (selectedRole === "admin" && classOption === "create") {
          toast({
            title: "Turma criada com sucesso!",
            description: "Você já pode fazer login. Compartilhe o código da turma com outros membros.",
          });
        } else {
          toast({
            title: "Cadastro realizado!",
            description: "Você já pode fazer login",
          });
        }
        setIsLogin(true);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4">
            <div className="w-40 h-40 mx-auto flex items-center justify-center">
                <img src={"/logo.png"} alt="logo"/>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Bem-vindo de volta!" : "Criar conta"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Entre com suas credenciais para acessar" 
              : "Preencha os dados para criar sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Usuário</Label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as "student" | "admin")}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="student">Aluno</option>
                    <option value="admin">Membro da Comissão</option>
                  </select>
                </div>

                {selectedRole === "admin" && (
                  <div className="space-y-2">
                    <Label>Opção de Turma</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setClassOption("create")}
                        className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                          classOption === "create"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:border-primary"
                        }`}
                      >
                        Criar Nova Turma
                      </button>
                      <button
                        type="button"
                        onClick={() => setClassOption("join")}
                        className={`flex-1 px-3 py-2 border rounded-md transition-colors ${
                          classOption === "join"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-input hover:border-primary"
                        }`}
                      >
                        Entrar em Turma
                      </button>
                    </div>
                  </div>
                )}

                {selectedRole === "admin" && classOption === "create" && (
                  <div className="space-y-2">
                    <Label htmlFor="className">Nome da Turma</Label>
                    <Input
                      id="className"
                      type="text"
                      placeholder="Ex: Turma 2025"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Um código único será gerado automaticamente para sua turma
                    </p>
                  </div>
                )}

                {(selectedRole === "student" || (selectedRole === "admin" && classOption === "join")) && (
                  <div className="space-y-2">
                    <Label htmlFor="classCode">Código da Turma</Label>
                    <Input
                      id="classCode"
                      type="text"
                      placeholder="Digite o código"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Solicite o código com um membro da comissão
                    </p>
                  </div>
                )}
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
