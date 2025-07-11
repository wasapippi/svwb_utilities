import { useState, useEffect } from 'react';
import { Container, Stack, Title, Divider, Radio, Group, Switch, Text } from '@mantine/core';
import { DotSelector } from '@/components/DotSelector';

export default function Home() {
  const [leader, setLeader] = useState<string>('dragon');
  const [firstOrSecond, setFirstOrSecond] = useState<string>('first');
  const [handCount, setHandCount] = useState<number>(4);
  const [turn, setTurn] = useState<number>(1);
  const [pp, setPp] = useState<number>(1);
  const [ep, setEp] = useState<number>(0);
  const [sep, setSep] = useState<number>(0);
  const [evolveUsed, setEvolveUsed] = useState<boolean>(false);
  const [superEvolveUsed, setSuperEvolveUsed] = useState<boolean>(false);

  const epMax = 2;
  const sepMax = 2;

  // EP/SEP 使用可能判定
  const isEpUsable = (firstOrSecond === 'first' && turn >= 5) || (firstOrSecond === 'second' && turn >= 4);
  const isSepUsable = (firstOrSecond === 'first' && turn >= 7) || (firstOrSecond === 'second' && turn >= 6);

  // 使用可能になった瞬間に最大値をセット
  useEffect(() => {
    if (isEpUsable && ep === 0) {
      setEp(epMax);
    }
  }, [isEpUsable]);

  useEffect(() => {
    if (isSepUsable && sep === 0) {
      setSep(sepMax);
    }
  }, [isSepUsable]);

  return (
    <Group>
      <Container size="xs" py="xl">
        <Stack gap="lg">
          <Title order={2}>🧠 対戦状況入力</Title>

          <Radio.Group label="相手リーダー" value={leader} onChange={setLeader}>
            <Group gap="xs" mt="xs">
              <Radio value="elf" label="エルフ" />
              <Radio value="royal" label="ロイヤル" />
              <Radio value="witch" label="ウィッチ" />
              <Radio value="dragon" label="ドラゴン" />
            </Group>
            <Group gap="xs" mt="xs">
              <Radio value="nightmare" label="ナイトメア" />
              <Radio value="bishop" label="ビショップ" />
              <Radio value="nemesis" label="ネメシス" />
            </Group>
          </Radio.Group>

          <Radio.Group label="あなたは先手？後手？" value={firstOrSecond} onChange={setFirstOrSecond}>
            <Group gap="md" mt="xs">
              <Radio value="first" label="先手" />
              <Radio value="second" label="後手" />
            </Group>
          </Radio.Group>

          <Divider />

          {/* Dot-based inputs */}
          
          <DotSelector value={turn} max={10} onChange={setTurn} label="相手の次のターン数" />
          <DotSelector value={pp} max={11} onChange={setPp} label="相手のPP (エクストラPP含む)" />

          <Divider />

          <DotSelector value={handCount} max={9} onChange={setHandCount} label="相手の手札枚数" />
          
          <Divider />

          <Group gap="xl">
            <DotSelector value={ep} max={2} onChange={setEp} disabled={!isEpUsable} label="進化ポイント" />
            <DotSelector value={sep} max={2} onChange={setSep} disabled={!isSepUsable} label="超進化ポイント" />
          </Group>

          <Divider />
        </Stack>
      </Container>
      <Container size="xs" py="xl">
        <Stack gap="lg">
          <Title order={2}>🧠 除去カード</Title>
          
        </Stack>
      </Container>

    </Group>
  );
}
