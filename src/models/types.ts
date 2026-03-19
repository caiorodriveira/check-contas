export interface Receita {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  data_recebimento: string;
  mes_referencia: string;
}

export type CategoriaDespesa = 'fixo' | 'assinatura' | 'cartao_credito' | 'outro';
export type FormaPagamento = 'pagamento_direto' | 'cartao';

export interface Despesa {
  id: string;
  nome: string;
  valor: number;
  categoria: CategoriaDespesa;
  forma_pagamento: FormaPagamento;
  cartao_id?: string;
  pago: boolean;
  data_vencimento: string;
  mes_referencia: string;
}

export interface Cartao {
  id: string;
  nome: string;
  limite: number;
  data_vencimento: string;
  mes_referencia: string;
}

export interface Pagamento {
  id: string;
  despesa_id: string;
  valor_pago: number;
  data_pagamento: string;
  observacao?: string;
}
