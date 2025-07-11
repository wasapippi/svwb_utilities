// pages/index.tsx
import { Button, Container, Stack, Title } from '@mantine/core';

export default function Home() {
  return (
    <Container size="xs" py="xl">
      <Stack>
        <Title order={2}>Mantine UI 導入完了 🎉</Title>
        <Button color="violet" radius="xl" size="lg" variant="filled">
          ボタンのテスト
        </Button>
      </Stack>
    </Container>
  );
}