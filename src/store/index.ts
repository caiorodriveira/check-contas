import { create } from 'zustand';
import { Despesa, Receita, Cartao } from '../models/types';
import { DespesasRepo, ReceitasRepo, CartoesRepo } from '../repositories';

interface AppState {
  currentMonth: string;
  despesas: Despesa[];
  receitas: Receita[];
  cartoes: Cartao[];
  setCurrentMonth: (month: string) => void;
  loadData: () => Promise<void>;
  addDespesa: (despesa: Despesa) => Promise<void>;
  toggleDespesaPago: (id: string, pago: boolean) => Promise<void>;
  addReceita: (receita: Receita) => Promise<void>;
  addCartao: (cartao: Cartao) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentMonth: new Date().toISOString().substring(0, 7), // YYYY-MM
  despesas: [],
  receitas: [],
  cartoes: [],

  setCurrentMonth: (month: string) => {
    set({ currentMonth: month });
    get().loadData();
  },

  loadData: async () => {
    const { currentMonth } = get();
    const [despesas, receitas, cartoes] = await Promise.all([
      DespesasRepo.getAllByMonth(currentMonth),
      ReceitasRepo.getAllByMonth(currentMonth),
      CartoesRepo.getAll()
    ]);
    
    // SQLite might return 'pago' as 0/1 instead of boolean, handle parsing
    const parsedDespesas = despesas.map(d => ({
      ...d,
      pago: Boolean(d.pago)
    }));
    
    set({ despesas: parsedDespesas, receitas, cartoes });
  },

  addDespesa: async (despesa: Despesa) => {
    await DespesasRepo.insert(despesa);
    await get().loadData();
  },

  toggleDespesaPago: async (id: string, pago: boolean) => {
    await DespesasRepo.updatePago(id, pago);
    await get().loadData();
  },

  addReceita: async (receita: Receita) => {
    await ReceitasRepo.insert(receita);
    await get().loadData();
  },

  addCartao: async (cartao: Cartao) => {
    await CartoesRepo.insert(cartao);
    await get().loadData();
  }
}));
