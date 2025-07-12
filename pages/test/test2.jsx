// 修正適用済みコード（PP上限が暴走しないよう修正済み）
import { useState } from 'react';
import {
  Container, Stack, Title, Select, Divider, Grid, Group, Button, ActionIcon, Text, rem, Card, Radio, Switch
} from '@mantine/core';
import { IconCircleFilled, IconCircle } from '@tabler/icons-react';
// 修正適用済みコード（PP上限が暴走しないよう修正済み）

function DotSelector({ value, max, onChange, label, disabled = false }) {
  return (
    <Stack gap={4}>
      <Group justify="space-between" wrap={false}>
        <Text size="sm">{label}</Text>
        <Text size="sm" c={disabled ? 'gray' : 'dimmed'}>{`${value} / ${max}`}</Text>
      </Group>
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
              onClick={() => onChange(clickValue === value ? 0 : clickValue)}
            >
              {selected ? <IconCircleFilled size={20} /> : <IconCircle size={20} />}
            </ActionIcon>
          );
        })}
      </Group>
    </Stack>
  );
}

const removalCards = [
  // ニュートラル
  {
    id: 'angelic_smite',
    name: '天罰の神撃',
    type: 'spell',
    leader: 'neutral',
    baseCost: 5,
    effects: [
      { mode: 'default', cost: 5, conditions: {}, effect: 'フォロワー1体に5ダメージ' }
    ]
  },
  // ウィッチ（エンハンスあり）
  {
    id: 'enhance_bolt',
    name: 'エンハンス・ボルト',
    type: 'spell',
    leader: 'witch',
    baseCost: 3,
    effects: [
      { mode: 'default', cost: 3, conditions: {}, effect: '敵1体に3ダメージ' },
      { mode: 'enhance', cost: 6, conditions: {}, effect: '敵全体に3ダメージ（エンハンス）' }
    ]
  }
];

function isEffectActive(effect, ctx) {
  const c = effect.conditions || {};
  if (c.minTurn !== undefined && ctx.turn < c.minTurn) return false;
  if (c.minPP !== undefined && ctx.pp < c.minPP) return false;
  if (c.evolveTokenMin !== undefined && ctx.ep < c.evolveTokenMin) return false;
  if (c.superEvolveTokenMin !== undefined && ctx.sep < c.superEvolveTokenMin) return false;

  // エンハンス強制判定：このエフェクトがdefaultかつ、同一カードにenhanceがありppがそのcost以上ならfalse
  if (effect.mode === 'default' && ctx.cardEffects) {
    const hasEnhance = ctx.cardEffects.some(e => e.mode === 'enhance' && e.cost <= ctx.pp);
    if (hasEnhance) return false;
  }

  if (effect.cost > ctx.pp) return false;
  return true;
}

export default function Home() {
  const [turn, setTurn] = useState(1);
  const [basePpMax, setBasePpMax] = useState(1);
  const [extraPpMax, setExtraPpMax] = useState(0);
  const [turnPpBonus, setTurnPpBonus] = useState(0);
  const [ppCurrent, setPpCurrent] = useState(1);
  const [ep, setEp] = useState(2);
  const [sep, setSep] = useState(2);
  const [firstOrSecond, setFirstOrSecond] = useState('first');
  const [extraPPUsed, setExtraPPUsed] = useState(true);
  const [evolveUsedThisTurn, setEvolveUsedThisTurn] = useState(false);
  const [handCount, setHandCount] = useState(4);
  const [leader, setLeader] = useState('dragon');

  const isEpUsable = (firstOrSecond === 'first' && turn >= 5) || (firstOrSecond === 'second' && turn >= 4);
  const isSepUsable = (firstOrSecond === 'first' && turn >= 7) || (firstOrSecond === 'second' && turn >= 6);
  const ppMax = Math.min(10 + extraPpMax, basePpMax + extraPpMax) + turnPpBonus;

  function advanceTurn() {
    const newTurn = turn + 1;
    const newBase = Math.min(10, newTurn);
    const cappedExtra = Math.min(extraPpMax, 10 - newBase);
    const newTurnPpBonus = !extraPPUsed ? 1 : 0;
    const newPpMax = Math.min(10 + cappedExtra, newBase + cappedExtra) + newTurnPpBonus;

    setTurn(newTurn);
    setBasePpMax(newBase);
    setExtraPpMax(cappedExtra);
    setTurnPpBonus(newTurnPpBonus);
    setTurnPpBonus(0);
    setPpCurrent(newPpMax);
    setHandCount((prev) => Math.min(prev + 1, 9));
    setEvolveUsedThisTurn(false);
  }

  function handleTurnChange(newTurn) {
    const turnDiff = newTurn - turn;
    if (turnDiff !== 1) {
      setEvolveUsedThisTurn(false);
      setExtraPPUsed(true);
      setEp(2);
      setSep(2);
    }
    if (newTurn === 6 && turn === 5) {
      setExtraPPUsed(true);
    }
    const newBase = Math.min(10, newTurn);
    const cappedExtra = Math.min(extraPpMax, 10 - newBase);
    const newPpMax = Math.min(10 + cappedExtra, newBase + cappedExtra);

    setTurn(newTurn);
    setBasePpMax(newBase);
    setExtraPpMax(cappedExtra);
    setTurnPpBonus(0);
    setPpCurrent(newPpMax);
  }

  const filteredCards = removalCards
    .filter(card => card.leader === leader || card.leader === 'neutral')
    .map((card) => ({
      ...card,
      availableEffects: card.effects
        .filter(eff => isEffectActive(eff, { turn, pp: ppCurrent, ep, sep, cardEffects: card.effects }))
        .sort((a, b) => b.cost - a.cost)
    }))
    .filter(c => c.availableEffects.length > 0)
    .sort((a, b) => b.baseCost - a.baseCost);

  return (
    <Group align="flex-start" wrap="nowrap">
      <Container size="sm" py="xl" style={{ minWidth: 300 }}>
        <Stack gap="lg">
          <Title order={2}>🧠 対戦状況</Title>
          <Text size="sm">リーダーと先後</Text>
<Group gap="md">
  <Select
    data={["elf", "royal", "witch", "dragon", "nightmare", "bishop", "nemesis"]}
    value={leader}
    onChange={setLeader}
    placeholder="リーダーを選択"
    allowDeselect={false}
    w={120}
  />
  <Radio.Group value={firstOrSecond} onChange={setFirstOrSecond}>
    <Group gap="md">
      <Radio value="first" label="先手" />
      <Radio value="second" label="後手" />
    </Group>
  </Radio.Group>
</Group>
          <Button onClick={advanceTurn}>次ターンへ →</Button>
          <DotSelector value={turn} max={10} onChange={handleTurnChange} label="ターン数" />
          <DotSelector value={handCount} max={9} onChange={setHandCount} label="相手の手札枚数" />
          <DotSelector value={ppCurrent} max={ppMax} onChange={(val) => setPpCurrent(Math.min(val, ppMax))} label={`現在のPP（上限: ${ppMax}）`} />

            <Group>
          {leader === 'dragon' && (
            <>
              <Button onClick={() => {
                setExtraPpMax(v => {
                  const next = Math.min(v + 1, Math.max(0, 10 - basePpMax));
                  const capped = Math.min(next, 10 - basePpMax);
                  const newPpMax = Math.min(10 + capped, basePpMax + capped);
                  if (ppCurrent > newPpMax) setPpCurrent(newPpMax);
                  return capped;
                });
              }}>PP上限 +1</Button>
              <Button onClick={() => {
                setExtraPpMax(v => {
                  const next = Math.max(v - 1, 0);
                  const capped = Math.min(next, 10 - basePpMax);
                  const newPpMax = Math.min(10 + capped, basePpMax + capped);
                  if (ppCurrent > newPpMax) setPpCurrent(newPpMax);
                  return capped;
                });
              }} color="red">PP上限 -1</Button>
            </>
          )}

          {firstOrSecond === 'second' && (
              <Switch
              label="エクストラPP"
              checked={!extraPPUsed}
              onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  setExtraPPUsed(!checked);
                  setTurnPpBonus(checked ? 1 : 0);
                  setPpCurrent(prev => Math.min(prev + (checked ? 1 : -1), ppMax));
                }}
                />
            )}

          </Group>
  <Grid gap="xl" align="flex-start">
    <Grid.Col span={6}>
        <Card withBorder padding="md" radius="md">
            <Group gap="xs"  wrap={false}>
                <DotSelector value={ep} max={2} onChange={setEp} disabled={!isEpUsable} label="EP" />
                <Button onClick={() => { setEp(v => Math.max(0, v - 1)); setEvolveUsedThisTurn(true); }} disabled={ep === 0 || evolveUsedThisTurn || !isEpUsable}>使う</Button>
            </Group>
        </Card>
    </Grid.Col>
    <Grid.Col span={6}>
        <Card  withBorder padding="md" radius="md">
            <Group gap="xs" wrap={false}>
                <DotSelector value={sep} max={2} onChange={setSep} disabled={!isSepUsable} label="SEP" />
                <Button onClick={() => { setSep(v => Math.max(0, v - 1)); setEvolveUsedThisTurn(true); }} disabled={sep === 0 || evolveUsedThisTurn || !isSepUsable}>使う</Button>
            </Group>
        </Card>
    </Grid.Col>

  </Grid>
        </Stack>
      </Container>
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Title order={2}>💥 使用可能な除去カード</Title>
          {filteredCards.map((card) => (
            <Card key={card.id} shadow="sm" withBorder>
              <Text fw="bold">{card.name}（{card.baseCost}コスト）</Text>
              {card.availableEffects.map((eff, i) => (
                <Group key={i} justify="space-between">
                  <Text size="sm">・{eff.effect}（{eff.cost}）</Text>
                  <Button
                    size="xs"
                    onClick={() => {
                      setPpCurrent(p => Math.max(0, Math.min(p - eff.cost, ppMax)));
                      setHandCount(h => Math.max(0, h - 1));
                    }}
                    disabled={eff.cost > ppCurrent}
                  >
                    使用
                  </Button>
                </Group>
              ))}
            </Card>
          ))}
        </Stack>
      </Container>
    </Group>
  );
}
