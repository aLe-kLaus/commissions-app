import React from 'react';
import { StyleSheet, TextInput, View, Text, TextInputProps } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
}

export function TextField({ label, ...rest }: TextFieldProps) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        placeholderTextColor={colors.textDim}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    color: colors.text,
    fontSize: 16,
  },
});
