import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Switch, Modal } from 'react-native';
import { useAppStore } from '../store';
import { generateId } from '../utils/uuid';
import { Despesa, CategoriaDespesa, FormaPagamento } from '../models/types';
import { formatarMoeda } from '../services/financas';

const CATEGORIAS: { label: string; value: CategoriaDespesa }[] = [
  { label: 'Fixo', value: 'fixo' },
  { label: 'Assinatura', value: 'assinatura' },
  { label: 'Cartão de Crédito', value: 'cartao_credito' },
  { label: 'Outro', value: 'outro' },
];

export default function DespesasScreen() {
  const { despesas, cartoes, currentMonth, addDespesa, toggleDespesaPago } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [categoria, setCategoria] = useState<CategoriaDespesa>('outro');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pagamento_direto');
  const [cartaoId, setCartaoId] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setNome(''); setValor(''); setDataVencimento('');
    setCategoria('outro'); setFormaPagamento('pagamento_direto');
    setCartaoId(undefined); setShowForm(false);
  };

  const handleAdd = async () => {
    if (!nome || !valor || !dataVencimento) return;
    const nova: Despesa = {
      id: generateId(),
      nome,
      valor: parseFloat(valor),
      categoria,
      forma_pagamento: formaPagamento,
      cartao_id: formaPagamento === 'cartao' ? cartaoId : undefined,
      pago: false,
      data_vencimento: dataVencimento,
      mes_referencia: currentMonth,
    };
    await addDespesa(nova);
    resetForm();
  };

  const renderItem = ({ item }: { item: Despesa }) => {
    const cartao = item.cartao_id ? cartoes.find(c => c.id === item.cartao_id) : null;
    return (
      <View style={[styles.card, item.pago && styles.cardPago]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardValor}>{formatarMoeda(item.valor)}</Text>
          <View style={styles.tagsRow}>
            <Text style={styles.tag}>{item.categoria}</Text>
            {cartao && <Text style={[styles.tag, styles.tagCartao]}>💳 {cartao.nome}</Text>}
          </View>
          <Text style={styles.cardDate}>Vence: {item.data_vencimento}</Text>
        </View>
        <View style={styles.statusCol}>
          <Text style={[styles.statusText, { color: item.pago ? '#22c55e' : '#ef4444' }]}>
            {item.pago ? '✓ Pago' : '✗ Pendente'}
          </Text>
          <Switch
            value={item.pago}
            onValueChange={(val) => toggleDespesaPago(item.id, val)}
            trackColor={{ false: '#e2e8f0', true: '#86efac' }}
            thumbColor={item.pago ? '#22c55e' : '#94a3b8'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add Button */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
        <Text style={styles.addBtnText}>+ Nova Despesa</Text>
      </TouchableOpacity>

      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Despesa</Text>

            <TextInput style={styles.input} placeholder="Nome da despesa" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={valor} onChangeText={setValor} />
            <TextInput style={styles.input} placeholder="Vencimento (DD/MM)" value={dataVencimento} onChangeText={setDataVencimento} />

            {/* Categoria */}
            <Text style={styles.formLabel}>Categoria</Text>
            <View style={styles.optionsRow}>
              {CATEGORIAS.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  style={[styles.optionChip, categoria === cat.value && styles.optionChipActive]}
                  onPress={() => setCategoria(cat.value)}
                >
                  <Text style={[styles.optionText, categoria === cat.value && styles.optionTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Forma de pagamento */}
            <Text style={styles.formLabel}>Forma de Pagamento</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionChip, formaPagamento === 'pagamento_direto' && styles.optionChipActive]}
                onPress={() => { setFormaPagamento('pagamento_direto'); setCartaoId(undefined); }}
              >
                <Text style={[styles.optionText, formaPagamento === 'pagamento_direto' && styles.optionTextActive]}>
                  Direto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionChip, formaPagamento === 'cartao' && styles.optionChipActive]}
                onPress={() => setFormaPagamento('cartao')}
              >
                <Text style={[styles.optionText, formaPagamento === 'cartao' && styles.optionTextActive]}>
                  Cartão
                </Text>
              </TouchableOpacity>
            </View>

            {/* Cartão selection */}
            {formaPagamento === 'cartao' && cartoes.length > 0 && (
              <>
                <Text style={styles.formLabel}>Selecionar Cartão</Text>
                <View style={styles.optionsRow}>
                  {cartoes.map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.optionChip, cartaoId === c.id && styles.optionChipActive]}
                      onPress={() => setCartaoId(c.id)}
                    >
                      <Text style={[styles.optionText, cartaoId === c.id && styles.optionTextActive]}>
                        {c.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.saveBtnModal} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* List */}
      <FlatList
        data={despesas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa cadastrada para este mês.</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  addBtn: {
    backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginBottom: 16, elevation: 2,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', elevation: 1,
    borderLeftWidth: 4, borderLeftColor: '#ef4444',
  },
  cardPago: { borderLeftColor: '#22c55e', opacity: 0.75 },
  cardNome: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cardValor: { fontSize: 14, color: '#ef4444', marginVertical: 2, fontWeight: '500' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  tag: {
    fontSize: 10, backgroundColor: '#e2e8f0', color: '#475569', paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 4, overflow: 'hidden',
  },
  tagCartao: { backgroundColor: '#dbeafe', color: '#2563eb' },
  cardDate: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  statusCol: { alignItems: 'center', marginLeft: 8 },
  statusText: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12,
    marginBottom: 12, fontSize: 15, backgroundColor: '#f8fafc',
  },
  formLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 4 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  optionChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0',
  },
  optionChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  optionText: { fontSize: 13, color: '#475569' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  formActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  saveBtnModal: {
    flex: 1, backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginRight: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelBtn: {
    flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginLeft: 8, borderWidth: 1, borderColor: '#e2e8f0',
  },
  cancelBtnText: { color: '#64748b', fontWeight: '600', fontSize: 15 },
});
