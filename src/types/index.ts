export interface AgendamentoCompleto {
  id: number;
  clienteId: number;
  cliente: {
    id: number;
    nome: string;
    telefone?: string;
  };
  dataIso: string;
  hora: string;
  totalCents: number;
  pagamento: 'PIX' | 'Dinheiro' | 'Cartão';
  obs?: string;
  servicos: {
    id: number;
    nome: string;
    qtd: number;
    precoUnitCents: number;
    duracaoMin: number;
  }[];
  createdAt: string;
}

export interface NovoAgendamentoForm {
  clienteId: number;
  dataIso: string;
  hora: string;
  pagamento: 'PIX' | 'Dinheiro' | 'Cartão';
  obs?: string;
  servicos: {
    servicoId: number;
    qtd: number;
  }[];
}

export interface RelatorioData {
  totalClientes: number;
  totalAgendamentos: number;
  totalServicos: number;
  faturamentoMes: number;
  faturamentoPorMes: {
    mes: string;
    valor: number;
  }[];
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}