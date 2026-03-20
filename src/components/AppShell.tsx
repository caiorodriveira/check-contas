import React, { ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store';
import { getNomeMes } from '../services/financas';
import { colors } from '../theme/colors';

interface AppShellProps {
  title: string;
  children: ReactNode;
}

const MENU_ITEMS = [
  { route: 'Dashboard', label: 'Dashboard', description: 'Resumo do mes' },
  { route: 'Despesas', label: 'Despesas', description: 'Contas e vencimentos' },
  { route: 'Receitas', label: 'Receitas', description: 'Entradas do periodo' },
  { route: 'Cartoes', label: 'Cartoes', description: 'Limites e faturas' },
];

export default function AppShell({ title, children }: AppShellProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { currentMonth } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (screen: string) => {
    setMenuOpen(false);
    if (route.name !== screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(true)}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{getNomeMes(currentMonth)}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>{children}</View>

      <Modal visible={menuOpen} animationType="fade" transparent onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={[styles.drawer, { paddingTop: insets.top + 18 }]}>
            <Text style={styles.drawerOverline}>Navegacao</Text>
            <Text style={styles.drawerTitle}>Check Contas</Text>
            <Text style={styles.drawerMonth}>{getNomeMes(currentMonth)}</Text>

            <View style={styles.drawerList}>
              {MENU_ITEMS.map(item => {
                const isActive = route.name === item.route;

                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                    onPress={() => handleNavigate(item.route)}
                  >
                    <Text style={[styles.drawerItemLabel, isActive && styles.drawerItemLabelActive]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.drawerItemDescription, isActive && styles.drawerItemDescriptionActive]}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: colors.background,
  },
  menuButton: {
    minWidth: 68,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  menuButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.textSoft,
    fontSize: 12,
    marginTop: 4,
  },
  headerSpacer: {
    width: 68,
  },
  content: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  drawer: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  drawerOverline: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  drawerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  drawerMonth: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 24,
  },
  drawerList: {
    gap: 10,
  },
  drawerItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  drawerItemActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.borderStrong,
  },
  drawerItemLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  drawerItemLabelActive: {
    color: '#cfe9ff',
  },
  drawerItemDescription: {
    color: colors.textMuted,
    fontSize: 12,
  },
  drawerItemDescriptionActive: {
    color: '#a9d4ff',
  },
});
