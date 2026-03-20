import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SummaryCard from '../components/SummaryCard';
import ProgressBar from '../components/ProgressBar';
import { useAppStore } from '../store';
import {
  agruparPendentes,
  calcularProgressoPagamento,
  calcularSaldo,
  calcularTotalDespesas,
  calcularTotalReceitas,
  calcularValorAPagar,
  calcularValorPago,
  formatarMoeda,
  getNomeMes,
} from '../services/financas';
import { colors, shadow } from '../theme/colors';
import AppShell from '../components/AppShell';

export default function DashboardScreen() {
  const { receitas, despesas, cartoes, currentMonth, setCurrentMonth, replicateMonth, clearMonthData } =
    useAppStore();
  const navigation = useNavigation<any>();

  const [showingSuccess, setShowingSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

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
      Animated.timing(fadeAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
          setShowingSuccess(false);
          scaleAnim.setValue(0.92);
        });
      }, 1400);
    });
  };

  const handleReplicate = () => {
    Alert.alert(
      'Replicar mes',
      `Deseja copiar receitas e despesas de ${getNomeMes(currentMonth)} para o proximo mes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Replicar',
          onPress: async () => {
            await replicateMonth();
            triggerSuccessAnimation();
          },
        },
      ]
    );
  };

  const handleClear = () => {
    Alert.alert(
      'Limpar dados',
      `Deseja apagar todos os registros de ${getNomeMes(currentMonth)}? Essa acao nao pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: async () => {
            await clearMonthData();
            Alert.alert('Mes limpo', 'Os dados foram removidos com sucesso.');
          },
        },
      ]
    );
  };

  const paidCount = despesas.filter(item => item.pago).length;

  return (
    <AppShell title="Dashboard">
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.overline}>Financeiro pessoal</Text>
              <Text style={styles.heroTitle}>Check Contas</Text>
            </View>
            <View style={styles.monthPill}>
              <Text style={styles.monthPillText}>{currentMonth}</Text>
            </View>
          </View>

          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthArrow}>
              <Text style={styles.monthArrowText}>{'<'}</Text>
            </TouchableOpacity>
            <View style={styles.monthCenter}>
              <Text style={styles.monthLabel}>Mes ativo</Text>
              <Text style={styles.monthText}>{getNomeMes(currentMonth)}</Text>
            </View>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthArrow}>
              <Text style={styles.monthArrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceWrap}>
            <Text style={styles.balanceLabel}>Saldo estimado</Text>
            <Text style={[styles.balanceValue, { color: saldo >= 0 ? colors.income : colors.expense }]}>
              {formatarMoeda(saldo)}
            </Text>
            <Text style={styles.balanceHint}>
              {saldo >= 0 ? 'Voce fecha o mes com folga.' : 'As despesas estao acima das receitas.'}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard
            title="Receitas"
            value={formatarMoeda(totalReceitas)}
            color={colors.income}
            style={styles.summaryCard}
          />
          <SummaryCard
            title="Despesas"
            value={formatarMoeda(totalDespesas)}
            color={colors.expense}
            style={styles.summaryCard}
          />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pagamento do mes</Text>
            <Text style={styles.sectionMeta}>{paidCount}/{despesas.length || 0} quitadas</Text>
          </View>
          <ProgressBar
            progress={progress}
            label={`Progresso geral ${progress.toFixed(0)}%`}
            color={progress >= 100 ? colors.income : colors.primary}
          />
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressLabel}>Pago</Text>
              <Text style={[styles.progressValue, { color: colors.income }]}>{formatarMoeda(valorPago)}</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressLabel}>Em aberto</Text>
              <Text style={[styles.progressValue, { color: colors.warning }]}>{formatarMoeda(valorAPagar)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atalhos</Text>
            <Text style={styles.sectionMeta}>Fluxo rapido</Text>
          </View>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Despesas')}>
              <Text style={styles.quickTitle}>Despesas</Text>
              <Text style={styles.quickDescription}>Cadastre, marque como pago e acompanhe vencimentos.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Receitas')}>
              <Text style={styles.quickTitle}>Receitas</Text>
              <Text style={styles.quickDescription}>Veja entradas do mes e atualize os recebimentos.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Cartoes')}>
              <Text style={styles.quickTitle}>Cartoes</Text>
              <Text style={styles.quickDescription}>Controle limites, uso atual e vencimento das faturas.</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.managementCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gestao do ciclo</Text>
            <Text style={styles.sectionMeta}>Rotina mensal</Text>
          </View>
          <View style={styles.managementRow}>
            <TouchableOpacity style={styles.primaryAction} onPress={handleReplicate}>
              <Text style={styles.primaryActionText}>Replicar mês</Text>
              <Text style={styles.primaryActionSubtext}>Leva os lancamentos para o proximo periodo.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleClear}>
              <Text style={styles.secondaryActionText}>Limpar mês</Text>
              <Text style={styles.secondaryActionSubtext}>Remove os dados atuais para recomecar.</Text>
            </TouchableOpacity>
          </View>
        </View>

        {pendentesAgrupados.length > 0 && (
          <View style={styles.pendingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pendencias</Text>
              <Text style={styles.sectionMeta}>{pendentesAgrupados.length} itens</Text>
            </View>
            {pendentesAgrupados.map(item => (
              <View
                key={item.id}
                style={[
                  styles.pendingCard,
                  item.tipo === 'fatura' ? styles.pendingCardInvoice : styles.pendingCardExpense,
                ]}
              >
                <View style={styles.pendingBadge}>
                  <Text
                    style={[
                      styles.pendingBadgeText,
                      { color: item.tipo === 'fatura' ? colors.accent : colors.warning },
                    ]}
                  >
                    {item.tipo === 'fatura' ? 'FATURA' : 'CONTA'}
                  </Text>
                </View>
                <View style={styles.pendingContent}>
                  <Text style={styles.pendingTitle}>{item.nome}</Text>
                  <Text style={styles.pendingSubtitle}>
                    {item.tipo === 'fatura' && item.despesas
                      ? `${item.despesas.length} despesas vinculadas`
                      : `Vencimento ${item.data_vencimento || '-'}`}
                  </Text>
                </View>
                <Text style={styles.pendingValue}>{formatarMoeda(item.valor)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {showingSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.successBox, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.successTitle}>Mês replicado</Text>
            <Text style={styles.successText}>Os dados foram copiados para o proximo ciclo.</Text>
          </Animated.View>
        </Animated.View>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  overline: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  monthPill: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthPillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 22,
    padding: 10,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthArrow: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthArrowText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  monthCenter: {
    flex: 1,
    alignItems: 'center',
  },
  monthLabel: {
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 4,
  },
  monthText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  balanceWrap: {
    alignItems: 'flex-start',
  },
  balanceLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  balanceHint: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionMeta: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  progressStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  progressStat: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 18,
    padding: 14,
  },
  progressLabel: {
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 6,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickSection: {
    marginTop: 18,
  },
  quickGrid: {
    gap: 12,
  },
  quickCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  quickDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  managementCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  managementRow: {
    gap: 12,
  },
  primaryAction: {
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  primaryActionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  primaryActionSubtext: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  secondaryAction: {
    backgroundColor: colors.expenseSoft,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#613142',
  },
  secondaryActionText: {
    color: '#ffdbe2',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  secondaryActionSubtext: {
    color: '#f6b9c4',
    fontSize: 13,
    lineHeight: 19,
  },
  pendingSection: {
    marginTop: 18,
  },
  pendingCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pendingCardExpense: {
    backgroundColor: colors.warningSoft,
    borderColor: '#5a451d',
  },
  pendingCardInvoice: {
    backgroundColor: colors.accentSoft,
    borderColor: '#245763',
  },
  pendingBadge: {
    minWidth: 60,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pendingContent: {
    flex: 1,
  },
  pendingTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  pendingSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
  },
  pendingValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  bottomSpace: {
    height: 18,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successBox: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    width: '100%',
    maxWidth: 320,
  },
  successTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
