// components/DotSelector.tsx
import { Group, ActionIcon, Text, Stack, rem } from '@mantine/core';
import { IconCircleFilled, IconCircle } from '@tabler/icons-react';

export function DotSelector({ value, max, onChange, label, disabled=false }) {
  return (
    <Stack gap={4}>
      {/* ラベルと現在値表示 */}
      <Group justify="space-between">
        <Text size="sm">{label}</Text>
        <Text size="sm" c={disabled ? 'gray' : 'dimmed'}>
          {disabled ? '使用不可' : `${value} / ${max}`}
        </Text>
      </Group>

      {/* ドットUI */}
      <Group gap={6}>
        {Array.from({ length: max }, (_, i) => {
          const selected = i < value;
          const clickValue = i + 1;

          return (
            <ActionIcon
              key={i}
              radius="xl"
              variant="light"
              disabled={disabled}
              color={selected ? 'blue' : 'gray'}
              size={rem(32)}
              onClick={() => {
                if (clickValue === value) {
                  onChange(0); // 同じ箇所をクリックでリセット
                } else {
                  onChange(clickValue);
                }
              }}
            >
              {selected ? <IconCircleFilled size={20} /> : <IconCircle size={20} />}
            </ActionIcon>
          );
        })}
      </Group>
    </Stack>
  );
}
