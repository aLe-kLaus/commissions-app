import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Application from 'expo-application';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, spacing } from '../../src/theme';
import { t } from '../../src/strings';
import { getAllSales, clearAllSales, bulkInsertSales } from '../../src/db/sales';
import { Sale } from '../../src/types';

interface ExportPayload {
  version: 1;
  exportedAt: string;
  sales: Sale[];
}

function isValidSale(value: unknown): value is Sale {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.valueCents === 'number' &&
    (s.type === 'store' || s.type === 'manager') &&
    typeof s.customer === 'string' &&
    typeof s.saleDate === 'string' &&
    typeof s.createdAt === 'string'
  );
}

export default function SettingsScreen() {
  const [busy, setBusy] = useState<string | null>(null);

  async function handleExport() {
    try {
      setBusy('export');
      const sales = await getAllSales();
      const payload: ExportPayload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        sales,
      };
      const filename = `comissoes-${new Date().toISOString().slice(0, 10)}.json`;
      const uri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/json',
          dialogTitle: t.exportData,
        });
      } else {
        Alert.alert(t.dataExported, uri);
      }
    } catch (err) {
      Alert.alert('Erro', String(err));
    } finally {
      setBusy(null);
    }
  }

  async function handleImport() {
    try {
      setBusy('import');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) {
        setBusy(null);
        return;
      }
      const text = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const parsed = JSON.parse(text) as Partial<ExportPayload>;
      if (!parsed || !Array.isArray(parsed.sales)) {
        throw new Error('Arquivo inválido');
      }
      const validSales = parsed.sales.filter(isValidSale) as Sale[];
      if (validSales.length === 0) {
        throw new Error('Nenhuma venda válida no arquivo');
      }

      Alert.alert(
        t.importData,
        `Importar ${validSales.length} venda(s)? Vendas com o mesmo ID serão sobrescritas.`,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.save,
            onPress: async () => {
              await bulkInsertSales(validSales);
              Alert.alert(t.dataImported, `${validSales.length} venda(s) importadas.`);
            },
          },
        ],
      );
    } catch (err) {
      Alert.alert('Erro', String(err));
    } finally {
      setBusy(null);
    }
  }

  function handleClear() {
    Alert.alert(t.clearAllData, t.confirmClearData, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          await clearAllSales();
          Alert.alert(t.dataCleared);
        },
      },
    ]);
  }

  const versionText = Application.nativeApplicationVersion ?? '1.0.0';

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <View style={styles.row}>
            <Button
              label={t.exportData}
              onPress={handleExport}
              variant="secondary"
              loading={busy === 'export'}
            />
          </View>
          <View style={styles.row}>
            <Button
              label={t.importData}
              onPress={handleImport}
              variant="secondary"
              loading={busy === 'import'}
            />
          </View>
          <View style={styles.row}>
            <Button label={t.clearAllData} onPress={handleClear} variant="danger" />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t.appVersion}</Text>
            <Text style={styles.aboutValue}>{versionText}</Text>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: {
    marginBottom: spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aboutLabel: {
    color: colors.textMuted,
    fontSize: 15,
  },
  aboutValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
