
import { useState, useEffect } from 'react';
import {
  Container, Stack, Title, Divider, Group, Button, ActionIcon, Text, rem, Card, Radio, Switch
} from '@mantine/core';
import { IconCircleFilled, IconCircle } from '@tabler/icons-react';

// DotSelector Component
function DotSelector({ value, max, onChange, label, disabled = false }) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Text size="sm">{label}</Text>
        <Text size="sm" c={disabled ? 'gray' : 'dimmed'}>
          {disabled ? '使用不可' : `${value} / ${max}`}
        </Text>
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
  {
    id: 'medusa',
    name: '猛毒姫・メドゥーサ',
    type: 'follower',
    leader: 'nightmare',
    baseCost: 7,
    effects: [{ mode: 'default', cost: 7, conditions: { minPP: 7 }, effect: '突進・交戦フォロワーを破壊' }]
  },
  {
    id: 'olivier',
    name: '勇壮の堕天使・オリヴィエ',
    type: 'follower',
    leader: 'nightmare',
    baseCost: 7,
    effects: [
      { mode: 'default', cost: 7, conditions: {}, effect: '突進、PP2回復' },
      { mode: 'super_evolve', cost: 0, conditions: { superEvolveTokenMin: 1, minPP: 7 }, effect: '超進化時：他フォロワー超進化' }
    ]
  },
  {
    id: 'death_strike',
    name: '死神の一振り',
    type: 'spell',
    leader: 'nightmare',
    baseCost: 1,
    effects: [{ mode: 'default', cost: 1, conditions: {}, effect: 'フォロワーを破壊' }]
  }
];

function isEffectActive(effect, ctx) {
  const c = effect.conditions || {};
  if (c.minTurn !== undefined && ctx.turn < c.minTurn) return false;
  if (c.minPP !== undefined && ctx.pp < c.minPP) return false;
  if (c.evolveTokenMin !== undefined && ctx.ep < c.evolveTokenMin) return false;
  if (c.superEvolveTokenMin !== undefined && ctx.sep < c.superEvolveTokenMin) return false;
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
  const [extraPPUsed, setExtraPPUsed] = useState(true); // default OFF
  const [evolveUsedThisTurn, setEvolveUsedThisTurn] = useState(false);
  const [handCount, setHandCount] = useState(4);
  const leader = 'dragon';

  const isEpUsable = (firstOrSecond === 'first' && turn >= 5) || (firstOrSecond === 'second' && turn >= 4);
  const isSepUsable = (firstOrSecond === 'first' && turn >= 7) || (firstOrSecond === 'second' && turn >= 6);
  const ppMax = Math.min(10 + extraPpMax, basePpMax + extraPpMax) + turnPpBonus;

  function advanceTurn() {
    const newTurn = turn + 1;
    setTurn(newTurn);
    const newBase = Math.min(10, newTurn);
    setBasePpMax(newBase);
    setTurnPpBonus(0);
    setPpCurrent(Math.min(newBase + extraPpMax, ppMax));
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
    setTurn(newTurn);
    const newBase = Math.min(10, newTurn);
    setBasePpMax(newBase);
    setTurnPpBonus(0);
    setPpCurrent(Math.min(newBase + extraPpMax, ppMax));
  }

  const filteredCards = removalCards
    .map((card) => ({
      ...card,
      availableEffects: card.effects
        .filter(eff => isEffectActive(eff, { turn, pp: ppCurrent, ep, sep }))
        .sort((a, b) => b.cost - a.cost)
    }))
    .filter(c => c.availableEffects.length > 0)
    .sort((a, b) => b.baseCost - a.baseCost);

  return (
    <Group align="flex-start" wrap="nowrap">
      <Container size="xs" py="xl">
        <Stack gap="lg">
          <Title order={2}>🧠 対戦状況</Title>
          <Radio.Group label="あなたは先手？後手？" value={firstOrSecond} onChange={setFirstOrSecond}>
            <Group gap="md">
              <Radio value="first" label="先手" />
              <Radio value="second" label="後手" />
            </Group>
          </Radio.Group>
          <Button onClick={advanceTurn}>次ターンへ →</Button>
          <DotSelector value={turn} max={10} onChange={handleTurnChange} label="ターン数" />
          <DotSelector value={handCount} max={9} onChange={setHandCount} label="相手の手札枚数" />
          <DotSelector value={ppCurrent} max={ppMax} onChange={(val) => setPpCurrent(Math.min(val, ppMax))} label={`現在のPP（上限: ${ppMax}）`} />

          {leader === 'dragon' && (
            <Group>
              <Button onClick={() => setExtraPpMax(v => Math.min(v + 1, 11 - basePpMax))}>PP上限 +1</Button>
              <Button onClick={() => setExtraPpMax(v => Math.max(v - 1, 0))} color="red">PP上限 -1</Button>
            </Group>
          )}

          {firstOrSecond === 'second' && (
            <Switch
              label="エクストラPP（後攻専用）"
              checked={!extraPPUsed}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setExtraPPUsed(!checked);
                setTurnPpBonus(checked ? 1 : 0);
                setPpCurrent(prev => Math.min(prev + (checked ? 1 : -1), ppMax));
              }}
            />
          )}

          <Group>
            <DotSelector value={ep} max={2} onChange={setEp} disabled={!isEpUsable} label="進化ポイント" />
            <Button onClick={() => { setEp(v => Math.max(0, v - 1)); setEvolveUsedThisTurn(true); }} disabled={ep === 0 || evolveUsedThisTurn}>進化を使う</Button>
          </Group>
          <Group>
            <DotSelector value={sep} max={2} onChange={setSep} disabled={!isSepUsable} label="超進化ポイント" />
            <Button onClick={() => { setSep(v => Math.max(0, v - 1)); setEvolveUsedThisTurn(true); }} disabled={sep === 0 || evolveUsedThisTurn}>超進化を使う</Button>
          </Group>
        </Stack>
      </Container>
      <Container size="xs" py="xl">
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
                    onClick={() => setPpCurrent(p => Math.max(0, Math.min(p - eff.cost, ppMax)))}
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
