import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from '../theme';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({ title, message, actionLabel, onAction, icon = '📊' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
    minWidth: 200,
  },
});
