import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, radius, spacing } from '../theme';
import { dateToISO, isoToDate } from '../lib/dates';
import { formatLongDate } from '../lib/format';

interface DateFieldProps {
  label?: string;
  valueISO: string;
  onChange: (iso: string) => void;
}

export function DateField({ label, valueISO, onChange }: DateFieldProps) {
  const [show, setShow] = useState(false);

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selected) {
      onChange(dateToISO(selected));
    }
  }

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setShow(true)} style={styles.field}>
        <Text style={styles.value}>{formatLongDate(valueISO)}</Text>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={isoToDate(valueISO)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date(2099, 11, 31)}
          minimumDate={new Date(2000, 0, 1)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  field: {
    backgroundColor: colors.surfaceDim,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
});
