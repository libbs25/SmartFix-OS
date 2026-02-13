
export enum OSStatus {
  OPEN = 'Adiantado', 
  MAINTENANCE = 'Em Manutenção',
  WAITING_PARTS = 'Aguardando Peças',
  READY = 'Em Aberto', 
  DELIVERED = 'Entregue'
}

export interface OSChecklist {
  powersOn: boolean;
  mainFunctionsTested: boolean;
  partReplaced: boolean;
  cleaned: boolean;
  finalApproval: boolean;
}

export interface ServiceOrder {
  id: string;
  osNumber: string;
  customerName: string;
  customerPhoto?: string;
  deviceType: string;
  brand: string;
  model: string;
  imei: string;
  password?: string;
  passwordType: 'text' | 'pattern';
  reportedDefect: string;
  status: OSStatus;
  paymentStatus?: 'pago' | 'pendente';
  notes: string;
  photos: string[];
  checklist: OSChecklist;
  createdAt: string;
  expectedDeliveryDate: string;
  completionDate?: string;
  cost?: number;
  workSummary?: string;
}

export type TabType = 'device' | 'notes' | 'photos' | 'checklist';
