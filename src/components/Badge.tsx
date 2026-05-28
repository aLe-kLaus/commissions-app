import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type BadgeVariant = 'store' | 'manager' | 'accent' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; fg: string }> = {
  store: { bg: '#0E89FF33', fg: colors.surface },
  manager: { bg: '#FF007F33', fg: colors.accent },
  accent: { bg: colors.accent, fg: colors.text },
  neutral: { bg: colors.border, fg: colors.textMuted },
};

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const v = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
