import { Despesa, Receita } from '../models/types';

/**
 * Calcula o total de receitas do mês
 */
export function calcularTotalReceitas(receitas: Receita[]): number {
  return receitas.reduce((acc, r) => acc + r.valor, 0);
}

/**
 * Calcula o total de despesas do mês
 */
export function calcularTotalDespesas(despesas: Despesa[]): number {
  return despesas.reduce((acc, d) => acc + d.valor, 0);
}

/**
 * Calcula o saldo do mês: receitas - despesas
 */
export function calcularSaldo(receitas: Receita[], despesas: Despesa[]): number {
  return calcularTotalReceitas(receitas) - calcularTotalDespesas(despesas);
}

/**
 * Calcula o valor total pago (despesas com pago = true)
 */
export function calcularValorPago(despesas: Despesa[]): number {
  return despesas.filter(d => d.pago).reduce((acc, d) => acc + d.valor, 0);
}

/**
 * Calcula o valor restante a pagar
 */
export function calcularValorAPagar(despesas: Despesa[]): number {
  return despesas.filter(d => !d.pago).reduce((acc, d) => acc + d.valor, 0);
}

/**
 * Calcula o progresso de pagamento em porcentagem (0–100)
 */
export function calcularProgressoPagamento(despesas: Despesa[]): number {
  const total = calcularTotalDespesas(despesas);
  if (total === 0) return 0;
  return (calcularValorPago(despesas) / total) * 100;
}

/**
 * Retorna despesas pendentes (não pagas) do mês
 */
export function getDespesasPendentes(despesas: Despesa[]): Despesa[] {
  return despesas.filter(d => !d.pago);
}

/**
 * Retorna despesas vinculadas a um cartão específico
 */
export function getDespesasPorCartao(despesas: Despesa[], cartaoId: string): Despesa[] {
  return despesas.filter(d => d.cartao_id === cartaoId);
}

/**
 * Calcula o total gasto em um cartão específico no mês
 */
export function calcularTotalCartao(despesas: Despesa[], cartaoId: string): number {
  return getDespesasPorCartao(despesas, cartaoId).reduce((acc, d) => acc + d.valor, 0);
}

/**
 * Formata um valor numérico como moeda BRL
 */
export function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

/**
 * Gera o nome do mês em português a partir de YYYY-MM
 */
export function getNomeMes(mesReferencia: string): string {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const [year, month] = mesReferencia.split('-').map(Number);
  return `${meses[month - 1]} ${year}`;
}
