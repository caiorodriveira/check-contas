import React from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from 'expo/node_modules/@expo/vector-icons';
import { colors } from '../theme/colors';

interface ReplicationSuccessModalProps {
  visible: boolean;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  replicatedMonthName: string;
  processedItems: number;
  completedAt: string;
  onClose: () => void;
}

export default function ReplicationSuccessModal({
  visible,
  fadeAnim,
  scaleAnim,
  replicatedMonthName,
  processedItems,
  completedAt,
  onClose,
}: ReplicationSuccessModalProps) {
  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.grid} pointerEvents="none" />
        <Animated.View style={[styles.screen, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.topBlock}>
            <View style={styles.hero}>
              <View style={styles.glow} />
              <View style={styles.halo}>
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>✓</Text>
                </View>
              </View>
            </View>

            <Text style={styles.title}>Mês Replicado com Sucesso!</Text>
            <Text style={styles.text}>
              Todas as suas despesas recorrentes e orçamentos foram projetados para {replicatedMonthName}.
            </Text>
            <Text style={styles.hint}>
              Confira as datas de vencimento das despesas e cartões e a data de recebimento das receitas.
            </Text>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View>
                  <Text style={styles.label}>Status do processo</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Concluído</Text>
                  </View>
                </View>
                <View style={styles.statusDate}>
                  <Text style={styles.label}>Data</Text>
                  <Text style={styles.dateValue}>{completedAt}</Text>
                </View>
              </View>

              <View style={styles.processRow}>
                <View style={styles.processIcon}>
                  <MaterialCommunityIcons name="swap-horizontal" size={22} color={colors.text} />
                </View>
                <View style={styles.processText}>
                  <Text style={styles.processTitle}>Transferência de dados</Text>
                  <Text style={styles.processSubtitle}>{processedItems} itens processados</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomBlock}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.9}>
                <Text style={styles.primaryButtonText}>Voltar para Dashboard</Text>
                <MaterialCommunityIcons name="arrow-right" size={24} color="#031e29" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.secondaryButtonText}>Ver extrato atualizado</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.brandBlock}>
              <Text style={styles.brand}>Check Contas</Text>
              <Text style={styles.brandSub}>Premium finance experience</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a1020',
    justifyContent: 'center',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
    borderWidth: 0.5,
    borderColor: 'rgba(69, 92, 136, 0.18)',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  topBlock: {
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 30,
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(72, 221, 188, 0.08)',
  },
  halo: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(37, 45, 67, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.income,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.income,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 10,
  },
  icon: {
    color: '#052114',
    fontSize: 42,
    fontWeight: '900',
  },
  title: {
    color: '#dde4fb',
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 18,
  },
  text: {
    color: '#a9b5c6',
    fontSize: 17,
    lineHeight: 29,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  hint: {
    color: '#c4d0df',
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  statusCard: {
    width: '100%',
    backgroundColor: 'rgba(23, 30, 49, 0.98)',
    borderRadius: 28,
    padding: 24,
    marginTop: 28,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  statusDate: {
    alignItems: 'flex-end',
  },
  label: {
    color: '#9ba8bf',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(72, 221, 188, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  badgeText: {
    color: colors.income,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dateValue: {
    color: '#dde4fb',
    fontSize: 17,
    fontWeight: '700',
  },
  processRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  processIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#313a50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processText: {
    flex: 1,
  },
  processTitle: {
    color: '#dde4fb',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  processSubtitle: {
    color: '#a9b5c6',
    fontSize: 14,
  },
  bottomBlock: {
    marginTop: 28,
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#18c7e2',
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonText: {
    color: '#031e29',
    fontSize: 19,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#353d52',
    borderRadius: 999,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#d4dcf3',
    fontSize: 17,
    fontWeight: '700',
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 16,
  },
  brand: {
    color: '#18c7e2',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  brandSub: {
    color: '#6f7d95',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3.2,
  },
});
