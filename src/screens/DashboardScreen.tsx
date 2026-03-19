import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useAppStore } from '../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SummaryCard from '../components/SummaryCard';
import ProgressBar from '../components/ProgressBar';
import {
  calcularTotalReceitas,
  calcularTotalDespesas,
  calcularSaldo,
  calcularValorPago,
  calcularValorAPagar,
  calcularProgressoPagamento,
  agruparPendentes,
  formatarMoeda,
  getNomeMes,
} from '../services/financas';

export default function DashboardScreen() {
  const { receitas, despesas, cartoes, currentMonth, setCurrentMonth, replicateMonth, clearMonthData } = useAppStore();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Animation state
  const [showingSuccess, setShowingSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const totalReceitas = calcularTotalReceitas(receitas);
  const totalDespesas = calcularTotalDespesas(despesas);
  const saldo = calcularSaldo(receitas, despesas);
  const valorPago = calcularValorPago(despesas);
  const valorAPagar = calcularValorAPagar(despesas);
  const progress = calcularProgressoPagamento(despesas);
  const pendentesAgrupados = agruparPendentes(despesas, cartoes);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const triggerSuccessAnimation = () => {
    setShowingSuccess(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          setShowingSuccess(false);
          scaleAnim.setValue(0.8);
        });
      }, 1500);
    });
  };

  const handleReplicate = () => {
    Alert.alert(
      'Replicar Mês',
      `Deseja copiar todas as receitas e despesas de ${getNomeMes(currentMonth)} para o próximo mês?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Replicar',
          onPress: async () => {
            await replicateMonth();
            triggerSuccessAnimation();
          }
        }
      ]
    );
  };

  const handleClear = () => {
    Alert.alert(
      'Limpar Dados',
      `Tem certeza que deseja apagar TODOS os dados de ${getNomeMes(currentMonth)}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            await clearMonthData();
            Alert.alert('Sucesso', 'Dados do mês removidos.');
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <Text style={styles.header}>💰 Check Contas</Text>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.monthArrow}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{getNomeMes(currentMonth)}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.monthArrow}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Saldo Card */}
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo estimado do Mês</Text>
          <Text style={[styles.saldoValue, { color: saldo >= 0 ? '#22c55e' : '#ef4444' }]}>
            {formatarMoeda(saldo)}
          </Text>
        </View>

        {/* Summary Cards Row */}
        <View style={styles.row}>
          <SummaryCard title="Receitas" value={formatarMoeda(totalReceitas)} color="#22c55e" style={{ width: '48%' }} />
          <SummaryCard title="Despesas" value={formatarMoeda(totalDespesas)} color="#ef4444" style={{ width: '48%' }} />
        </View>

        {/* Month Management */}
        {/* <Text style={styles.sectionTitle}>Gestão do Mês</Text> */}
        <View style={styles.managementRow}>
          <TouchableOpacity style={styles.mgmtBtn} onPress={handleReplicate}>
            <Text style={styles.mgmtBtnIcon}>🔄</Text>
            <Text style={styles.mgmtBtnText}>Replicar Mês</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mgmtBtn, styles.mgmtBtnDelete]} onPress={handleClear}>
            <Text style={[styles.mgmtBtnIcon, { color: '#ef4444' }]}>🗑️</Text>
            <Text style={[styles.mgmtBtnText, { color: '#ef4444' }]}>Limpar Mês</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Progress */}
        <View style={styles.progressCard}>
          <ProgressBar
            progress={progress}
            label={`Progresso de Pagamentos (${progress.toFixed(0)}%)`}
            color={progress >= 100 ? '#22c55e' : '#3b82f6'}
          />
          <View style={styles.rowBetween}>
            <Text style={styles.subLabel}>Pago: {formatarMoeda(valorPago)}</Text>
            <Text style={styles.subLabel}>Pendente: {formatarMoeda(valorAPagar)}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Despesas')}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionLabel}>Despesas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Receitas')}>
            <Text style={styles.actionIcon}>💵</Text>
            <Text style={styles.actionLabel}>Receitas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Cartoes')}>
            <Text style={styles.actionIcon}>💳</Text>
            <Text style={styles.actionLabel}>Cartões</Text>
          </TouchableOpacity>
        </View>



        {/* Despesas Pendentes (agrupadas por cartão) */}
        {pendentesAgrupados.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pendências do Mês</Text>
            {pendentesAgrupados.map(item => (
              <View
                key={item.id}
                style={[
                  styles.pendenteCard,
                  item.tipo === 'fatura' && styles.pendenteCardFatura,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>
                      {item.tipo === 'fatura' ? '💳' : '📄'}
                    </Text>
                    <Text style={styles.pendenteNome}>{item.nome}</Text>
                  </View>
                  {item.tipo === 'despesa' && item.data_vencimento && (
                    <Text style={styles.pendenteVence}>Vence: {item.data_vencimento}</Text>
                  )}
                  {item.tipo === 'fatura' && item.despesas && (
                    <Text style={styles.pendenteVence}>
                      {item.despesas.length} {item.despesas.length === 1 ? 'despesa' : 'despesas'} vinculadas
                      {"\n"}Vence: {item.data_vencimento}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.pendenteValor,
                  item.tipo === 'fatura' && { color: '#7c3aed' },
                ]}>
                  {formatarMoeda(item.valor)}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Success Animation Overlay */}
      {showingSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.successBox, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.successIcon}>✨</Text>
            <Text style={styles.successText}>Mês Replicado!</Text>
            <Text style={styles.successSubText}>Dados copiados com sucesso.</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', paddingHorizontal: 16 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#0f172a', marginTop: 16, marginBottom: 4 },
  monthSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginVertical: 12, padding: 10, backgroundColor: '#e2e8f0', borderRadius: 10,
  },
  monthArrow: { paddingHorizontal: 16, paddingVertical: 4 },
  arrowText: { fontSize: 16, color: '#3b82f6', fontWeight: 'bold' },
  monthText: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginHorizontal: 8 },
  saldoCard: {
    backgroundColor: '#0f172a', padding: 24, borderRadius: 16, marginBottom: 16,
    alignItems: 'center', elevation: 4,
  },
  saldoLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  saldoValue: { fontSize: 32, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  progressCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2, marginBottom: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  subLabel: { fontSize: 12, color: '#64748b' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12, marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: {
    width: '31%', backgroundColor: '#fff', paddingVertical: 20, borderRadius: 14,
    alignItems: 'center', elevation: 2
  },
  actionIcon: { fontSize: 28 },
  actionLabel: { fontWeight: '600', color: '#6366f1', marginTop: 8, fontSize: 13 },

  managementRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  mgmtBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', padding: 14, borderRadius: 12, elevation: 1,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  mgmtBtnDelete: { borderColor: '#fee2e2' },
  mgmtBtnIcon: { fontSize: 18, marginRight: 8 },
  mgmtBtnText: { fontWeight: '600', color: '#475569', fontSize: 13 },

  pendenteCard: {
    backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', elevation: 1,
    borderLeftWidth: 4, borderLeftColor: '#f59e0b',
  },
  pendenteCardFatura: {
    borderLeftColor: '#7c3aed', backgroundColor: '#faf5ff',
  },
  pendenteNome: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  pendenteVence: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  pendenteValor: { fontSize: 15, fontWeight: 'bold', color: '#ef4444' },

  // Success Animation
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  successBox: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successText: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  successSubText: { fontSize: 14, color: '#64748b' },
});
