import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, CheckCircle2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const BankIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bankData, setBankData] = useState({
    bank: "",
    agency: "",
    account: "",
    accountType: "",
  });

  const handleConnect = async () => {
    if (!bankData.bank || !bankData.agency || !bankData.account || !bankData.accountType) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsConnecting(true);
    
    // Simulação de conexão
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast.success("Conta bancária conectada com sucesso!");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setBankData({
      bank: "",
      agency: "",
      account: "",
      accountType: "",
    });
    toast.success("Conta bancária desconectada");
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Conta Conectada</CardTitle>
                  <CardDescription>Sua conta bancária está sincronizada</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="font-medium">{bankData.bank}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium capitalize">{bankData.accountType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agência</p>
                <p className="font-medium">{bankData.agency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conta</p>
                <p className="font-medium">{bankData.account}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDisconnect}
            >
              Desconectar Conta
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sincronização Automática</CardTitle>
            <CardDescription>
              As transações da conta bancária serão sincronizadas automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Funcionalidade em Desenvolvimento</p>
                <p>
                  A sincronização bancária está sendo implementada. Em breve, todas as
                  transações serão importadas automaticamente para o sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Conectar Conta Bancária</CardTitle>
              <CardDescription>
                Sincronize a conta da turma com o sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Select 
              value={bankData.bank} 
              onValueChange={(value) => setBankData({ ...bankData, bank: value })}
            >
              <SelectTrigger id="bank">
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                <SelectItem value="Bradesco">Bradesco</SelectItem>
                <SelectItem value="Caixa Econômica">Caixa Econômica</SelectItem>
                <SelectItem value="Itaú">Itaú</SelectItem>
                <SelectItem value="Santander">Santander</SelectItem>
                <SelectItem value="Nubank">Nubank</SelectItem>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="C6 Bank">C6 Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Tipo de Conta</Label>
            <Select 
              value={bankData.accountType} 
              onValueChange={(value) => setBankData({ ...bankData, accountType: value })}
            >
              <SelectTrigger id="accountType">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Conta Corrente</SelectItem>
                <SelectItem value="poupança">Conta Poupança</SelectItem>
                <SelectItem value="pagamento">Conta Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agência</Label>
              <Input
                id="agency"
                placeholder="0000"
                value={bankData.agency}
                onChange={(e) => setBankData({ ...bankData, agency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account">Conta</Label>
              <Input
                id="account"
                placeholder="00000-0"
                value={bankData.account}
                onChange={(e) => setBankData({ ...bankData, account: e.target.value })}
              />
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              "Conectando..."
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Conectar Conta
              </>
            )}
          </Button>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Segurança dos Dados</p>
              <p>
                Suas informações bancárias são criptografadas e protegidas. A
                conexão permite apenas leitura de transações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankIntegration;
