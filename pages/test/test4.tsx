"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  Stack,
  Title,
  Grid,
  Group,
  Button,
  ActionIcon,
  Text,
  rem,
  Card,
  Radio,
  Switch,
  Badge,
  Textarea,
  Tabs,
  ScrollArea,
  Collapse,
  Modal,
  NumberInput,
  HoverCard,
  Image,
  Container,
  Tooltip,
  Indicator,
  ThemeIcon,
  Divider,
  Alert,
  Progress,
} from "@mantine/core"
import {
  IconCircleFilled,
  IconCircle,
  IconSword,
  IconShield,
  IconBrain,
  IconHistory,
  IconChevronDown,
  IconChevronUp,
  IconUsers,
  IconRefresh,
  IconPlus,
  IconMinus,
  IconBoxMultiple,
  IconInfoCircle,
  IconTarget,
  IconFlame,
  IconSparkles,
  IconCards,
  IconTrendingUp,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

// --- Constants & Data Definitions ---
const CARD_TYPES = {
  follower: (
    <Badge miw={100} size="lg" color="blue" variant="light" c="white">
      フォロワー
    </Badge>
  ),
  spell: (
    <Badge miw={100} size="lg" color="violet" variant="light" c="white">
      スペル
    </Badge>
  ),
}

const EFFECT_MODES = {
  default: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="gray"
      variant="filled"
    >
      基本効果
    </Badge>
  ),
  enhance: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="orange"
      variant="filled"
    >
      エンハンス
    </Badge>
  ),
  evolve: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="yellow"
      variant="filled"
    >
      進化
    </Badge>
  ),
  super_evolve: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="violet"
      variant="filled"
    >
      超進化
    </Badge>
  ),
  necromancy: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="grape"
      variant="filled"
    >
      ネクロマンス
    </Badge>
  ),
  awakening: (
    <Badge
      styles={{ label: { textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px  1px 0 black, 1px  1px 0 black` } }}
      style={{ border: "2px solid white" }}
      miw={90}
      color="red"
      variant="filled"
    >
      覚醒
    </Badge>
  ),
}

const THREAT_COLORS = {
  critical: "red",
  high: "orange",
  medium: "yellow",
  low: "blue",
}

const THREAT_LABELS = {
  critical: "最重要",
  high: "重要",
  medium: "注意",
  low: "軽微",
}

const REMOVAL_CARDS = [
  {
    id: "royal1",
    name: "勇猛のルミナスランサー",
    type: "follower",
    leader: "royal",
    baseCost: 2,
    attack: 1,
    toughness: 2,
    effects: [
      { mode: "default", cost: 2, conditions: {}, effect: "ナイト1枚を自分の場に出す。<br> 自分の兵士・フォロワーが場に出たとき、それは【突進】を持つ" },
    ],
    imageUrl: "/img/1/royal/勇猛のルミナスランサー.png", // Placeholder image
  },{
    id: "royal2",
    name: "異端の侍",
    type: "follower",
    leader: "royal",
    baseCost: 2,
    attack: 2,
    toughness: 1,
    effects: [
      { mode: "default", cost: 2, conditions: {}, effect: "超進化可能ターンなら、これは【必殺】を持つ<br>【突進】" },
    ],
    imageUrl: "/img/1/royal/異端の侍.png", // Placeholder image
  },{
    id: "royal3",
    name: "刹那のクイックブレイダー",
    type: "follower",
    leader: "royal",
    baseCost: 1,
    attack: 1,
    toughness: 1,
    effects: [
      { mode: "default", cost: 1, conditions: {}, effect: "【疾走】" },
    ],
    imageUrl: "/img/1/royal/刹那のクイックブレイダー.png", // Placeholder image
  },{
    id: "royal4",
    name: "ミリタリードッグ",
    type: "follower",
    leader: "royal",
    baseCost: 3,
    attack: 4,
    toughness: 2,
    effects: [
      { mode: "default", cost: 3, conditions: {}, effect: "突進" },
      { mode: "enhance", cost: 6, conditions: {}, effect: "【6コスト】ミリタリードッグ2枚を自分の場に出す" },
    ],
    imageUrl: "/img/1/royal/ミリタリードッグ.png", // Placeholder image
  },{
    id: "royal5",
    name: "サイレントスナイパー・ワルツ",
    type: "follower",
    leader: "royal",
    baseCost: 3,
    attack: 2,
    toughness: 1,
    effects: [
      { mode: "default", cost: 3, conditions: {}, effect: "相手の場のフォロワー1枚を選ぶ。それに5ダメージ" },
      { mode: "enhance", cost: 6, conditions: {}, effect: "【6コスト】これは+2/+2して【潜伏】を持つ" },
    ],
    imageUrl: "/img/1/royal/サイレントスナイパー・ワルツ.png", // Placeholder image
  },{
    id: "royal6",
    name: "レヴィオンの迅雷・アルベール",
    type: "follower",
    leader: "royal",
    baseCost: 5,
    attack: 3,
    toughness: 5,
    effects: [
      { mode: "default", cost: 5, conditions: {}, effect: "【疾走】" },
      { mode: "enhance", cost: 9, conditions: {}, effect: "【9コスト】相手の場のフォロワーすべてに3ダメージ。これは「1ターンに2回攻撃できる。」をもつ" },
    ],
    imageUrl: "/img/1/royal/レヴィオンの迅雷・アルベール.png", // Placeholder image
  },{
    id: "royal7",
    name: "レヴィオンアックス・ジェノ",
    type: "follower",
    leader: "royal",
    baseCost: 7,
    attack: 7,
    toughness: 6,
    effects: [
      { mode: "default", cost: 7, conditions: {}, effect: "【突進】<br>1ターンに2回攻撃できる。<br>【攻撃時】これは【バリア】を持つ。ナイト1枚を自分の場に出す" },
    ],
    imageUrl: "/img/1/royal/レヴィオンアックス・ジェノ.png", // Placeholder image
  },{
    id: "royal8",
    name: "テンタクルバイト",
    type: "spell",
    leader: "royal",
    baseCost: 7,
    effects: [
      { mode: "default", cost: 7, conditions: {}, effect: "相手の場のフォロワー1枚か相手のリーダーを選ぶ。それに5ダメージ。自分のリーダーを5回復" },
    ],
    imageUrl: "/img/1/royal/テンタクルバイト.png", // Placeholder image
  },{
    id: "royal9",
    name: "ケンタウロスの騎士",
    type: "follower",
    leader: "royal",
    baseCost: 8,
    attack: 7,
    toughness: 5,
    effects: [
      { mode: "default", cost: 8, conditions: {}, effect: "【疾走】" },
    ],
    imageUrl: "/img/1/royal/ケンタウロスの騎士.png", // Placeholder image
  },{
    id: "royal10",
    name: "煌刃の勇者・アマリア",
    type: "follower",
    leader: "royal",
    baseCost: 8,
    attack: 6,
    toughness: 6,
    effects: [
      { mode: "default", cost: 8, conditions: {}, effect: "スティールナイト(2/2)4枚を自分の場に出す。<br>自分の他のフォロワーが場に出たとき、それは+1/+0して【突進】と【守護】を持つ。" },
    ],
    imageUrl: "/img/1/royal/煌刃の勇者・アマリア.png", // Placeholder image
  },{
    id: "royal11",
    name: "剣士の斬撃",
    type: "spell",
    leader: "royal",
    baseCost: 4,
    effects: [
      { mode: "default", cost: 8, conditions: {}, effect: "相手の場のフォロワー1枚を選ぶ。それを破壊。『スティールナイト』1枚を自分の場に出す。s" },
    ],
    imageUrl: "/img/1/royal/剣士の斬撃.png", // Placeholder image
  },

  
  {
    id: "neutral1",
    name: "楽朗の天宮・フィルドア",
    type: "follower",
    leader: "neutral",
    baseCost: 2,
    attack: 2,
    toughness: 2,
    effects: [
      { mode: 'evolve', cost: 0, conditions: { evolveTokenMin: 1 }, effect: '相手の場のフォロワー1枚を選ぶ。それを破壊' },
    ],
    imageUrl: "/img/1/neutral/楽朗の天宮・フィルドア.png", // Placeholder image
  },{
    id: "neutral2",
    name: "迸る巧妙・アポロン",
    type: "follower",
    leader: "neutral",
    baseCost: 3,
    attack: 1,
    toughness: 2,
    effects: [
      { mode: "default", cost: 3, conditions: {}, effect: "敵全体に1ダメージ" },
      { mode: 'evolve', cost: 0, conditions: { evolveTokenMin: 1 }, effect: "敵全体に1ダメージ" },
    ],
    imageUrl: "/img/1/neutral/迸る巧妙・アポロン.png", // Placeholder image
  },{
    id: "neutral3",
    name: "神の雷霆",
    type: "spell",
    leader: "neutral",
    baseCost: 4,
    effects: [{ mode: "default", cost: 5, conditions: {}, effect: "相手の場の攻撃力最大のフォロワーからランダムに1枚を破壊。相手の場のフォロワーすべてに1ダメージ" }],
    imageUrl: "/img/1/neutral/神の雷霆.png", // Placeholder image
  },{
    id: "neutral5",
    name: "勇壮の堕天使・オリヴィエ",
    type: "follower",
    leader: "neutral",
    baseCost: 7,
    attack: 4,
    toughness: 4,
    effects: [
      { mode: "default", cost: 7, conditions: {}, effect: "自分のデッキから2枚引く。自分のリーダーを2回復。自分のPPを2回復" },
      { mode: 'super_evolve', cost: 0, conditions: { evolveTokenMin: 1 }, effect: "自分の場の他の進化前野フォロワーを1枚選ぶ。それは超進化する" },
    ],
    imageUrl: "/img/1/neutral/勇壮の堕天使・オリヴィエ.png", // Placeholder image
  },
  {
    id: "orivie",
    name: "オリヴィエ",
    type: "follower",
    leader: "witch",
    baseCost: 3,
    attack: 2,
    toughness: 3,
    effects: [
      { mode: "default", cost: 3, conditions: {}, effect: "敵1体に3ダメージ" },
      { mode: "enhance", cost: 6, conditions: {}, effect: "敵全体に3ダメージ（エンハンス）" },
      { mode: 'evolve', cost: 0, conditions: { evolveTokenMin: 1 }, effect: '進化時：他フォロワー進化' },
      { mode: 'super_evolve', cost: 0, conditions: { superEvolveTokenMin: 1 }, effect: '超進化時：他フォロワー超進化' }
    ],
    imageUrl: "https://placehold.co/100x150/000000/FFFFFF?text=オリヴィエ", // Placeholder image
  }
]

const STRONG_MOVES = {
  dragon: [
    { turn: 4, move: "ドラゴンナイト召喚 + PP加速", threat: "high" },
    { turn: 6, move: "大型フォロワー展開", threat: "critical" },
    { turn: 7, move: "覚醒能力発動 + 全体除去", threat: "critical" },
    { turn: 8, move: "バハムート級の切り札", threat: "critical" },
  ],
  witch: [
    { turn: 3, move: "スペルブースト蓄積", threat: "medium" },
    { turn: 5, move: "知恵の光 + 手札補充", threat: "high" },
    { turn: 7, move: "超越コンボ開始", threat: "critical" },
  ],
  bishop: [
    { turn: 4, move: "治癒の祈り + 回復", threat: "low" },
    { turn: 6, move: "テミスの審判", threat: "high" },
    { turn: 8, move: "セラフ召喚", threat: "critical" },
  ],
  nightmare: [
    { turn: 3, move: "スケルトン召喚 + 墓地肥やし", threat: "medium" },
    { turn: 5, move: "ファントムハウル + 墓地消費", threat: "high" },
    { turn: 7, move: "モルディカイ降臨", threat: "critical" },
  ],
  royal: [
    { turn: 2, move: "兵士展開 + 盤面制圧", threat: "medium" },
    { turn: 4, move: "指揮官効果発動", threat: "high" },
    { turn: 6, move: "大型兵士召喚", threat: "high" },
    { turn: 8, move: "フィニッシャー展開", threat: "critical" },
  ],
  elf: [
    { turn: 3, move: "フェアリー大量展開", threat: "medium" },
    { turn: 5, move: "コンボ始動", threat: "high" },
    { turn: 7, move: "リノセウス級コンボ", threat: "critical" },
  ],
  nemesis: [
    { turn: 4, move: "アーティファクト生成", threat: "medium" },
    { turn: 6, move: "合成コンボ開始", threat: "high" },
    { turn: 8, move: "最終アーティファクト召喚", threat: "critical" },
  ],
}

const LEADERS = [
  { value: "elf", label: "エルフ", color: "green", icon: "🌿" },
  { value: "royal", label: "ロイヤル", color: "blue", icon: "⚔️" },
  { value: "witch", label: "ウィッチ", color: "purple", icon: "🔮" },
  { value: "dragon", label: "ドラゴン", color: "red", icon: "🐉" },
  { value: "nightmare", label: "ナイトメア", color: "dark", icon: "💀" },
  { value: "bishop", label: "ビショップ", color: "yellow", icon: "✨" },
  { value: "nemesis", label: "ネメシス", color: "cyan", icon: "🤖" },
]

const NEMESIS_ARTIFACT_TOKENS = [
  { id: "puppet", name: "操り人形", cost: 1, attack: 1, defense: 1, effect: "効果：なし", category: "puppet" },
  {
    id: "enhanced_puppet",
    name: "強化型操り人形",
    cost: 1,
    attack: 2,
    defense: 2,
    effect: "効果：なし",
    category: "puppet",
  },
  {
    id: "past_core",
    name: "パスト・コア",
    cost: 1,
    attack: 1,
    defense: 1,
    effect: "1コストのアーティファクトと合成した時にキャッスルアーティファクトに変身する",
    category: "core",
  },
  {
    id: "future_core",
    name: "フューチャー・コア",
    cost: 1,
    attack: 1,
    defense: 1,
    effect: "1コストのアーティファクトと合成した時にアタックアーティファクトに変身する",
    category: "core",
  },
  {
    id: "castle_artifact",
    name: "キャッスルアーティファクト",
    cost: 3,
    attack: null,
    defense: null,
    effect: "これに【融合】したカードのコストの合計によって変身する。",
    category: "intermediate_artifact",
  },
  {
    id: "attack_artifact",
    name: "アタックアーティファクト",
    cost: 3,
    attack: null,
    defense: null,
    effect: "これに【融合】したカードのコストの合計によって変身する。",
    category: "intermediate_artifact",
  },
  {
    id: "destroy_artifact_alpha",
    name: "デストロイアーティファクトα",
    cost: 5,
    attack: null,
    defense: null,
    effect:
      "『デストロイアーティファクトβ』や『デストロイアーティファクトγ』をそれぞれこれに【融合】したとき、『イクシードアーティファクトΩ』に変身する。",
    category: "destroy_artifact",
  },
  {
    id: "destroy_artifact_beta",
    name: "デストロイアーティファクトβ",
    cost: 5,
    attack: null,
    defense: null,
    effect: "効果：なし",
    category: "destroy_artifact",
  },
  {
    id: "destroy_artifact_gamma",
    name: "デストロイアーティファクトγ",
    cost: 5,
    attack: null,
    defense: null,
    effect: "効果：なし",
    category: "destroy_artifact",
  },
  {
    id: "exceed_artifact_omega",
    cost: 10,
    name: "イクシードアーティファクトΩ",
    attack: null,
    defense: null,
    effect: "効果：なし",
    category: "final_artifact",
  },
]

// --- Helper Functions ---
function isEffectActive(effect: any, ctx: any): boolean {
  const c = effect.conditions || {}

  if (effect.mode === "necromancy_modifier") {
    return c.necromancyCost !== undefined && ctx.graveyardCount >= c.necromancyCost
  }
  if (effect.mode === "awakening_modifier") {
    return ctx.ppMax !== undefined && ctx.ppMax >= 7
  }

  if (c.minTurn !== undefined && ctx.turn < c.minTurn) return false
  if (c.minPP !== undefined && ctx.pp < c.minPP) return false

  if ((c.evolveTokenMin !== undefined || c.superEvolveTokenMin !== undefined) && ctx.evolveUsedThisTurn) {
    return false
  }
  if (c.evolveTokenMin !== undefined && ctx.ep < c.evolveTokenMin) return false
  if (c.superEvolveTokenMin !== undefined && ctx.sep < c.superEvolveTokenMin) return false

  if (effect.mode === "evolve" && !ctx.isEpUsable) return false
  if (effect.mode === "super_evolve" && !ctx.isSepUsable) return false

  return effect.cost <= ctx.pp
}

function getActionableEffect(card: any, ctx: any): any | null {
  const enhanceEffect = card.effects.find((eff: any) => eff.mode === "enhance")
  if (
    enhanceEffect &&
    isEffectActive(enhanceEffect, {
      turn: ctx.turn,
      pp: ctx.pp,
      ppMax: ctx.ppMax,
      ep: ctx.ep,
      sep: ctx.sep,
      graveyardCount: ctx.graveyardCount,
      cardEffects: card.effects,
      evolveUsedThisTurn: ctx.evolveUsedThisTurn,
      isEpUsable: ctx.isEpUsable,
      isSepUsable: ctx.isSepUsable,
    })
  ) {
    return enhanceEffect
  }

  const defaultEffect = card.effects.find((eff: any) => eff.mode === "default")
  if (
    defaultEffect &&
    isEffectActive(defaultEffect, {
      turn: ctx.turn,
      pp: ctx.pp,
      ppMax: ctx.ppMax,
      ep: ctx.ep,
      sep: ctx.sep,
      graveyardCount: ctx.graveyardCount,
      cardEffects: card.effects,
      evolveUsedThisTurn: ctx.evolveUsedThisTurn,
      isEpUsable: ctx.isEpUsable,
      isSepUsable: ctx.isSepUsable,
    })
  ) {
    return defaultEffect
  }

  return null
}

// --- Enhanced Components ---

function DotSelector({ value, max, onChange, label, disabled = false, knownCount = 0, knownColor = "green" }: any) {
  return (
    <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
      <Stack gap={8}>
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c={disabled ? "dark.3" : "blue.3"} fw={500}>
            {label}
          </Text>
          <Badge variant="light" color={disabled ? "dark" : "blue"} size="sm">
            {value} / {max}
          </Badge>
        </Group>
        <Group gap={6} justify="center">
          {Array.from({ length: max }, (_, i) => {
            const isKnown = i < knownCount
            const isSelected = i < value
            let dotColor = "dark"

            if (isKnown) {
              dotColor = knownColor
            } else if (isSelected) {
              dotColor = "blue"
            }

            return (
              <Tooltip key={i} label={`${i + 1}${isKnown ? " (確定)" : ""}`} position="top">
                <ActionIcon
                  radius="xl"
                  variant="light"
                  disabled={disabled}
                  color={dotColor}
                  size={rem(36)}
                  onClick={() => {
                    const clickValue = i + 1
                    onChange(clickValue === value ? 0 : clickValue)
                  }}
                  style={{
                    backgroundColor:
                      dotColor === knownColor
                        ? `var(--mantine-color-${knownColor}-9)`
                        : dotColor === "blue"
                          ? `var(--mantine-color-blue-9)`
                          : `var(--mantine-color-dark-6)`,
                    border: `2px solid ${dotColor === knownColor ? `var(--mantine-color-${knownColor}-7)` : dotColor === "blue" ? `var(--mantine-color-blue-7)` : `var(--mantine-color-dark-4)`}`,
                    transition: "all 0.2s ease",
                    ...(disabled && {
                      backgroundColor: "var(--mantine-color-dark-9)",
                      border: "2px solid var(--mantine-color-dark-7)",
                      color: "var(--mantine-color-dark-5)",
                    }),
                  }}
                >
                  {isSelected ? <IconCircleFilled size={20} /> : <IconCircle size={20} />}
                </ActionIcon>
              </Tooltip>
            )
          })}
        </Group>
      </Stack>
    </Card>
  )
}

function RemovalCardBlock({ card, ppCurrent, ppMax, onUseCard, actionableEffect }: any) {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const isDisabled = !actionableEffect

  const hoverCardContent = useMemo(() => {
    if (!actionableEffect) {
      return (
        <Text size="sm" c="white">
          現在使用可能な効果はありません。
        </Text>
      )
    }
    const activeEffects = card.availableEffects
      .filter((eff: any) => eff.effect)
      .map((eff: any, i: number) => (
        <Group key={i} wrap="nowrap" align="center" gap="xs">
          {eff.mode.endsWith("_modifier")
            ? EFFECT_MODES[eff.mode.replace("_modifier", "") as keyof typeof EFFECT_MODES]
            : EFFECT_MODES[eff.mode as keyof typeof EFFECT_MODES]}
          <Text size="sm" c="white" dangerouslySetInnerHTML={{ __html: eff.effect.replace(/\n/g, "<br/>") }} />
        </Group>
      ))
    return activeEffects.length > 0 ? (
      <Stack gap={8}>{activeEffects}</Stack>
    ) : (
      <Text size="sm" c="white">
        効果なし
      </Text>
    )
  }, [actionableEffect, card.availableEffects])

  const effectBadges = useMemo(() => {
    if (!actionableEffect) return null
    const activeEffects = card.availableEffects
      .filter((eff: any) => eff.mode !== "default")
      .map((eff: any, i: number) => (
        <div key={i}>
          {eff.mode.endsWith("_modifier")
            ? EFFECT_MODES[eff.mode.replace("_modifier", "") as keyof typeof EFFECT_MODES]
            : EFFECT_MODES[eff.mode as keyof typeof EFFECT_MODES]}
        </div>
      ))
    return activeEffects.length > 0 ? (
      <Stack gap="xs" style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
        {activeEffects}
      </Stack>
    ) : null
  }, [actionableEffect, card.availableEffects])

  return (
    <Card
      shadow="md"
      withBorder
      style={{
        backgroundColor: "var(--mantine-color-dark-7)",
        borderColor: isDisabled ? "var(--mantine-color-dark-5)" : "var(--mantine-color-blue-6)",
        transition: "all 0.2s ease",
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <Stack gap="sm">
        <HoverCard
          width={400}
          shadow="md"
          openDelay={200}
          closeDelay={400}
          position="bottom"
          offset={10}
          withArrow
          styles={{
            dropdown: {
              backgroundColor: "var(--mantine-color-dark-5)",
              borderColor: "var(--mantine-color-blue-7)",
              borderWidth: 1,
              borderStyle: "solid",
            },
          }}
        >
          <HoverCard.Target>
            <div style={{ position: "relative" }}>
              <Image
                src={card.imageUrl || "/placeholder.svg"}
                alt={card.name}
                width={120}
                height={180}
                radius="md"
                style={{
                  cursor: "pointer",
                  border: `2px solid ${isDisabled ? "var(--mantine-color-dark-5)" : "var(--mantine-color-blue-6)"}`,
                  transition: "all 0.2s ease",
                }}
                onClick={() => setShowDetailsModal(true)}
                fallbackSrc="/placeholder.svg?height=180&width=120"
              />
              {effectBadges}
            </div>
          </HoverCard.Target>
          <HoverCard.Dropdown>{hoverCardContent}</HoverCard.Dropdown>
        </HoverCard>

        <Group justify="space-between" align="center">
          <Stack gap={4} style={{ flex: 1 }}>
            <Text size="xs" c="blue.4" fw={500}>
              {card.name}
            </Text>
            <Group gap="xs">
              <Badge size="sm" color="blue" variant="light">
                {card.displayCost}PP
              </Badge>
              {card.type === "follower" && (
                <Badge size="sm" color="gray" variant="light">
                  {card.attack}/{card.toughness}
                </Badge>
              )}
            </Group>
          </Stack>

          <Button
            size="sm"
            variant="gradient"
            gradient={{ from: "blue.8", to: "blue.6" }}
            onClick={() => actionableEffect && onUseCard(card, actionableEffect)}
            disabled={isDisabled}
            leftSection={<IconTarget size={16} />}
            styles={{
              root: {
                "&[data-disabled]": {
                  backgroundColor: "var(--mantine-color-dark-9) !important",
                  color: "var(--mantine-color-dark-5) !important",
                  cursor: "not-allowed",
                },
              },
            }}
          >
            使用
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={showDetailsModal}
        size="xl"
        onClose={() => setShowDetailsModal(false)}
        title={
          <Group justify="space-between" w="100%">
            <Title order={3} c="blue.3">
              {card.name} - 詳細
            </Title>
            <Button
              size="sm"
              variant="gradient"
              gradient={{ from: "blue.8", to: "blue.6" }}
              onClick={() => actionableEffect && onUseCard(card, actionableEffect)}
              disabled={isDisabled}
              leftSection={<IconTarget size={16} />}
            >
              使用
            </Button>
          </Group>
        }
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: { backgroundColor: "var(--mantine-color-dark-8)", borderColor: "var(--mantine-color-blue-9)" },
          header: {
            backgroundColor: "var(--mantine-color-dark-8)",
            borderBottom: "1px solid var(--mantine-color-dark-6)",
          },
          title: { color: "var(--mantine-color-blue-3)" },
          close: { color: "var(--mantine-color-blue-3)" },
        }}
      >
        <Grid>
          <Grid.Col span="content">
            <Image
              src={card.imageUrl || "/placeholder.svg"}
              alt={card.name}
              width={150}
              height={225}
              radius="md"
              style={{ border: "2px solid var(--mantine-color-blue-6)" }}
              fallbackSrc="/placeholder.svg?height=225&width=150"
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Stack gap="md">
              <Group>
                {CARD_TYPES[card.type]}
                <Badge color="blue" variant="light" size="lg">
                  {card.baseCost}コスト
                </Badge>
                {card.type === "follower" && (
                  <Badge color="gray" variant="light" size="lg">
                    {card.attack}/{card.toughness}
                  </Badge>
                )}
              </Group>
              <Divider />
              <Stack gap="sm">
                {card.effects.map((eff: any, i: number) => (
                  <Card key={i} withBorder p="sm" style={{ backgroundColor: "var(--mantine-color-dark-6)" }}>
                    <Group wrap="nowrap" align="flex-start" gap="sm">
                      {eff.mode.endsWith("_modifier")
                        ? EFFECT_MODES[eff.mode.replace("_modifier", "") as keyof typeof EFFECT_MODES]
                        : EFFECT_MODES[eff.mode as keyof typeof EFFECT_MODES]}
                      <Text
                        size="sm"
                        c="white"
                        dangerouslySetInnerHTML={{ __html: eff.effect.replace(/\n/g, "<br/>") }}
                      />
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>
      </Modal>
    </Card>
  )
}

function ThreatBadge({ threat }: { threat: keyof typeof THREAT_COLORS }) {
  const icons = {
    critical: <IconAlertTriangle size={16} />,
    high: <IconFlame size={16} />,
    medium: <IconInfoCircle size={16} />,
    low: <IconCheck size={16} />,
  }

  return (
    <Badge color={THREAT_COLORS[threat]} variant="light" leftSection={icons[threat]} size="lg">
      {THREAT_LABELS[threat]}
    </Badge>
  )
}

function NemesisTokenCard({ token, count, handleArtifactCountChange, handCount }: any) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card
      withBorder
      p="sm"
      style={{
        backgroundColor: "var(--mantine-color-dark-7)",
        borderColor: count > 0 ? "var(--mantine-color-cyan-6)" : "var(--mantine-color-dark-5)",
        transition: "all 0.2s ease",
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c="cyan.4" fw={500} truncate>
            {token.name}
          </Text>
          <ActionIcon variant="subtle" color="cyan" size="sm" onClick={() => setShowDetails((o) => !o)}>
            {showDetails ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        </Group>

        <Group justify="space-between" align="center">
          <Indicator
            color="cyan"
            disabled={count === 0}
            size={16}
            label={count}
            styles={{ indicator: { fontWeight: 700 } }}
          >
            <ThemeIcon variant="light" color="cyan" size="lg">
              <IconBoxMultiple size={20} />
            </ThemeIcon>
          </Indicator>

          <Group gap="xs">
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              onClick={() => handleArtifactCountChange(token.id, -1)}
              disabled={count <= 0}
            >
              <IconMinus size={14} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="cyan"
              size="sm"
              onClick={() => handleArtifactCountChange(token.id, 1)}
              disabled={handCount >= 9}
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Group>
        </Group>

        <Collapse in={showDetails}>
          <Divider my="xs" />
          <Stack gap="xs">
            <Group>
              <Badge size="xs" color="cyan" variant="light">
                {token.cost}PP
              </Badge>
              {token.attack !== null && (
                <Badge size="xs" color="gray" variant="light">
                  {token.attack}/{token.defense}
                </Badge>
              )}
            </Group>
            <Text size="xs" c="cyan.2">
              {token.effect}
            </Text>
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  )
}

function NumericCounter({ value, onChange, label, min = 0, max = Number.POSITIVE_INFINITY, icon }: any) {
  return (
    <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
      <Stack gap="sm">
        <Group gap="xs">
          {icon && (
            <ThemeIcon variant="light" color="blue" size="sm">
              {icon}
            </ThemeIcon>
          )}
          <Text size="sm" c="blue.3" fw={500}>
            {label}
          </Text>
        </Group>
        <Group justify="space-between" wrap="nowrap">
          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
          >
            <IconMinus size={20} />
          </ActionIcon>
          <NumberInput
            value={value}
            onChange={(val) => {
              if (typeof val === "number") {
                onChange(Math.min(max, Math.max(min, val)))
              }
            }}
            min={min}
            max={max}
            hideControls
            styles={{
              input: {
                textAlign: "center",
                backgroundColor: "var(--mantine-color-dark-6)",
                color: "var(--mantine-color-blue-1)",
                border: "1px solid var(--mantine-color-dark-4)",
                fontSize: "18px",
                fontWeight: 700,
              },
            }}
            w={80}
          />
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
          >
            <IconPlus size={20} />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  )
}

// --- Main Application Component ---
export default function Home() {
  // --- State Management ---
  const [turn, setTurn] = useState(1)
  const [basePpMax, setBasePpMax] = useState(1)
  const [extraPpMax, setExtraPpMax] = useState(0)
  const [turnPpBonus, setTurnPpBonus] = useState(0)
  const [ppCurrent, setPpCurrent] = useState(1)
  const [ep, setEp] = useState(2)
  const [sep, setSep] = useState(2)
  const [firstOrSecond, setFirstOrSecond] = useState("first")
  const [extraPPUsedThisTurn, setExtraPPUsedThisTurn] = useState(false)
  const [evolveUsedThisTurn, setEvolveUsedThisTurn] = useState(false)
  const [handCount, setHandCount] = useState(4)
  const [leader, setLeader] = useState<string | null>(null)
  const [fairyCount, setFairyCount] = useState(0)
  const [graveyardCount, setGraveyardCount] = useState(0)
  const [tokenNotes, setTokenNotes] = useState("")
  const [gameHistory, setGameHistory] = useState<Array<{ turn: number; action: string; pp: number; hand: number }>>([])
  const [isLeaderModalOpened, setIsLeaderModalOpened] = useState(false)

  // Nemesis artifact states
  const [puppetCount, setPuppetCount] = useState(0)
  const [enhancedPuppetCount, setEnhancedPuppetCount] = useState(0)
  const [pastCoreCount, setPastCoreCount] = useState(0)
  const [futureCoreCount, setFutureCoreCount] = useState(0)
  const [castleArtifactCount, setCastleArtifactCount] = useState(0)
  const [attackArtifactCount, setAttackArtifactCount] = useState(0)
  const [destroyArtifactAlphaCount, setDestroyArtifactAlphaCount] = useState(0)
  const [destroyArtifactBetaCount, setDestroyArtifactBetaCount] = useState(0)
  const [destroyArtifactGammaCount, setDestroyArtifactGammaCount] = useState(0)
  const [exceedArtifactOmegaCount, setExceedArtifactOmegaCount] = useState(0)

  // Synthesis modal states
  const [isSynthesisModalOpened, setIsSynthesisModalOpened] = useState(false)
  const [synthesisTarget, setSynthesisTarget] = useState<string | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({})
  const [synthesisError, setSynthesisError] = useState("")

  // --- Helper Functions ---
  const resetGameStates = useCallback(() => {
    setTurn(1)
    setBasePpMax(1)
    setExtraPpMax(0)
    setTurnPpBonus(0)
    setPpCurrent(1)
    setEp(2)
    setSep(2)
    setFirstOrSecond("first")
    setExtraPPUsedThisTurn(false)
    setEvolveUsedThisTurn(false)
    setHandCount(4)
    setFairyCount(0)
    setGraveyardCount(0)
    setPuppetCount(0)
    setEnhancedPuppetCount(0)
    setPastCoreCount(0)
    setFutureCoreCount(0)
    setCastleArtifactCount(0)
    setAttackArtifactCount(0)
    setDestroyArtifactAlphaCount(0)
    setDestroyArtifactBetaCount(0)
    setDestroyArtifactGammaCount(0)
    setExceedArtifactOmegaCount(0)
    setTokenNotes("")
    setGameHistory([])
    setSynthesisError("")
  }, [])

  useEffect(() => {
    setIsLeaderModalOpened(true)
  }, [])

  // --- Derived State ---
  const isEpUsable = useMemo(
    () => (firstOrSecond === "first" && turn >= 5) || (firstOrSecond === "second" && turn >= 4),
    [firstOrSecond, turn],
  )
  const isSepUsable = useMemo(
    () => (firstOrSecond === "first" && turn >= 7) || (firstOrSecond === "second" && turn >= 6),
    [firstOrSecond, turn],
  )

  const ppMax = useMemo(() => {
    const currentBaseMax = Math.min(10, turn)
    const currentExtraCapped = Math.min(extraPpMax, 10 - currentBaseMax)
    return Math.min(10, currentBaseMax + currentExtraCapped) + turnPpBonus
  }, [turn, extraPpMax, turnPpBonus])

  const filteredCards = useMemo(() => {
    if (handCount === 0 || leader === null) {
      return []
    }

    return REMOVAL_CARDS.filter((card) => card.leader === leader || card.leader === "neutral")
      .map((card) => {
        const actionableEffectForButton = getActionableEffect(card, {
          turn,
          pp: ppCurrent,
          ppMax,
          ep,
          sep,
          graveyardCount,
          evolveUsedThisTurn,
          isEpUsable,
          isSepUsable,
        })

        if (!actionableEffectForButton) {
          return null
        }

        const calculatedDisplayCost = actionableEffectForButton.cost
        const displayableEffects = []

        displayableEffects.push(actionableEffectForButton)

        card.effects.forEach((eff: any) => {
          if (eff === actionableEffectForButton) return

          if (
            isEffectActive(eff, {
              turn,
              pp: ppCurrent,
              ppMax,
              ep,
              sep,
              graveyardCount,
              cardEffects: card.effects,
              evolveUsedThisTurn,
              isEpUsable,
              isSepUsable,
            })
          ) {
            const displayMode = eff.mode.endsWith("_modifier") ? eff.mode.replace("_modifier", "") : eff.mode
            displayableEffects.push({ ...eff, mode: displayMode })
          }
        })

        displayableEffects.sort((a: any, b: any) => {
          const order = {
            enhance: 1,
            default: 2,
            awakening: 3,
            necromancy: 4,
            evolve: 5,
            super_evolve: 6,
          }
          return (order[a.mode as keyof typeof order] || 99) - (order[b.mode as keyof typeof order] || 99)
        })

        return {
          ...card,
          displayCost: calculatedDisplayCost,
          actionableEffect: actionableEffectForButton,
          availableEffects: displayableEffects,
        }
      })
      .filter((c) => c !== null)
      .sort((a, b) => b.displayCost - a.displayCost)
  }, [leader, turn, ppCurrent, ppMax, ep, sep, graveyardCount, evolveUsedThisTurn, isEpUsable, isSepUsable, handCount])

  const currentStrongMoves = useMemo(() => {
    if (leader === null) {
      return []
    }
    return (
      STRONG_MOVES[leader as keyof typeof STRONG_MOVES]?.filter((move) => move.turn <= turn + 2 && move.turn >= turn) ||
      []
    )
  }, [leader, turn])

  const totalKnownArtifacts = useMemo(() => {
    if (leader === "elf") {
      return fairyCount
    } else if (leader === "nemesis") {
      return (
        (puppetCount || 0) +
        (enhancedPuppetCount || 0) +
        (pastCoreCount || 0) +
        (futureCoreCount || 0) +
        (castleArtifactCount || 0) +
        (attackArtifactCount || 0) +
        (destroyArtifactAlphaCount || 0) +
        (destroyArtifactBetaCount || 0) +
        (destroyArtifactGammaCount || 0) +
        (exceedArtifactOmegaCount || 0)
      )
    }
    return 0
  }, [
    leader,
    fairyCount,
    puppetCount,
    enhancedPuppetCount,
    pastCoreCount,
    futureCoreCount,
    castleArtifactCount,
    attackArtifactCount,
    destroyArtifactAlphaCount,
    destroyArtifactBetaCount,
    destroyArtifactGammaCount,
    exceedArtifactOmegaCount,
  ])

  const currentLeaderData = useMemo(() => {
    return LEADERS.find((l) => l.value === leader)
  }, [leader])

  // --- Handlers ---
  const advanceTurn = useCallback(() => {
    const newTurn = turn + 1
    const newBasePpMax = Math.min(10, newTurn)
    const currentExtraCapped = Math.min(extraPpMax, 10 - newBasePpMax)

    let newTurnPpBonus = 0
    if (firstOrSecond === "second" && !extraPPUsedThisTurn) {
      newTurnPpBonus = 1
    }

    const newPpMaxForNextTurn = Math.min(10, newBasePpMax + currentExtraCapped) + newTurnPpBonus

    setGameHistory((prev) => [
      ...prev,
      {
        turn,
        action: `ターン${newTurn}へ進行`,
        pp: ppCurrent,
        hand: handCount,
      },
    ])

    setTurn(newTurn)
    setBasePpMax(newBasePpMax)
    setExtraPpMax(currentExtraCapped)
    setTurnPpBonus(newTurnPpBonus)
    setPpCurrent(newPpMaxForNextTurn)
    setHandCount((prev) => Math.min(prev + 1, 9))
    setEvolveUsedThisTurn(false)
    setExtraPPUsedThisTurn(false)
    setGraveyardCount((prev) => prev + 1)

    if (leader !== "elf") {
      setFairyCount(0)
    }
    if (leader !== "nemesis") {
      setPuppetCount(0)
      setEnhancedPuppetCount(0)
      setPastCoreCount(0)
      setFutureCoreCount(0)
      setCastleArtifactCount(0)
      setAttackArtifactCount(0)
      setDestroyArtifactAlphaCount(0)
      setDestroyArtifactBetaCount(0)
      setDestroyArtifactGammaCount(0)
      setExceedArtifactOmegaCount(0)
    }
  }, [turn, extraPpMax, ppCurrent, handCount, firstOrSecond, extraPPUsedThisTurn, leader])

  const handleTurnChange = useCallback(
    (newTurn: number) => {
      if (newTurn !== turn) {
        setEvolveUsedThisTurn(false)
        setExtraPPUsedThisTurn(false)
        setEp(2)
        setSep(2)
      }

      const newBase = Math.min(10, newTurn)
      const cappedExtra = Math.min(extraPpMax, 10 - newBase)
      const newCalculatedPpMax =
        Math.min(10, newBase + cappedExtra) + (firstOrSecond === "second" && !extraPPUsedThisTurn ? 1 : 0)

      setTurn(newTurn)
      setBasePpMax(newBase)
      setExtraPpMax(cappedExtra)
      setTurnPpBonus(firstOrSecond === "second" && !extraPPUsedThisTurn ? 1 : 0)
      setPpCurrent(newCalculatedPpMax)

      if (leader !== "elf") {
        setFairyCount(0)
      }
      if (leader !== "nemesis") {
        setPuppetCount(0)
        setEnhancedPuppetCount(0)
        setPastCoreCount(0)
        setFutureCoreCount(0)
        setCastleArtifactCount(0)
        setAttackArtifactCount(0)
        setDestroyArtifactAlphaCount(0)
        setDestroyArtifactBetaCount(0)
        setDestroyArtifactGammaCount(0)
        setExceedArtifactOmegaCount(0)
      }
    },
    [turn, extraPpMax, firstOrSecond, extraPPUsedThisTurn, leader],
  )

  const handleUseCard = useCallback(
    (card: any, effectToUse: any) => {
      const newPp = Math.max(0, ppCurrent - effectToUse.cost)
      const newHandCount = Math.max(0, handCount - 1)
      let newGraveyardCount = graveyardCount

      const necromancyModifier = card.effects.find((eff: any) => eff.mode === "necromancy_modifier")
      if (
        necromancyModifier &&
        isEffectActive(necromancyModifier, {
          turn,
          pp: ppCurrent,
          ppMax,
          ep,
          sep,
          graveyardCount,
          cardEffects: card.effects,
          evolveUsedThisTurn,
          isEpUsable,
          isSepUsable,
        })
      ) {
        newGraveyardCount = Math.max(0, graveyardCount - (necromancyModifier.conditions?.necromancyCost || 0))
      } else {
        newGraveyardCount = graveyardCount + 1
      }

      setPpCurrent(newPp)
      setHandCount(newHandCount)
      setGraveyardCount(newGraveyardCount)
      setGameHistory((prev) => [
        ...prev,
        {
          turn,
          action: `${card.name} (${(EFFECT_MODES[effectToUse.mode as keyof typeof EFFECT_MODES] as any).props.children})使用`,
          pp: newPp,
          hand: newHandCount,
        },
      ])

      if (card.id === "fairy_token" && fairyCount > 0) {
        setFairyCount((prev) => Math.max(0, prev - 1))
      }
    },
    [ppCurrent, handCount, graveyardCount, turn, fairyCount, ppMax],
  )

  const handlePpMaxIncrease = useCallback(() => {
    setExtraPpMax((prevExtra) => {
      const newBase = Math.min(10, turn)
      const newExtra = Math.min(prevExtra + 1, 10 - newBase)
      const potentialPpMax = Math.min(10, newBase + newExtra) + turnPpBonus
      if (ppCurrent > potentialPpMax) setPpCurrent(potentialPpMax)
      return newExtra
    })
  }, [turn, ppCurrent, turnPpBonus])

  const handlePpMaxDecrease = useCallback(() => {
    setExtraPpMax((prevExtra) => {
      const newBase = Math.min(10, turn)
      const newExtra = Math.max(0, prevExtra - 1)
      const potentialPpMax = Math.min(10, newBase + newExtra) + turnPpBonus
      if (ppCurrent > potentialPpMax) setPpCurrent(potentialPpMax)
      return newExtra
    })
  }, [turn, ppCurrent, turnPpBonus])

  // Simplified artifact handlers for brevity
  const getArtifactCount = useCallback(
    (tokenId: string) => {
      const counts: Record<string, number> = {
        puppet: puppetCount,
        enhanced_puppet: enhancedPuppetCount,
        past_core: pastCoreCount,
        future_core: futureCoreCount,
        castle_artifact: castleArtifactCount,
        attack_artifact: attackArtifactCount,
        destroy_artifact_alpha: destroyArtifactAlphaCount,
        destroy_artifact_beta: destroyArtifactBetaCount,
        destroy_artifact_gamma: destroyArtifactGammaCount,
        exceed_artifact_omega: exceedArtifactOmegaCount,
      }
      return counts[tokenId] || 0
    },
    [
      puppetCount,
      enhancedPuppetCount,
      pastCoreCount,
      futureCoreCount,
      castleArtifactCount,
      attackArtifactCount,
      destroyArtifactAlphaCount,
      destroyArtifactBetaCount,
      destroyArtifactGammaCount,
      exceedArtifactOmegaCount,
    ],
  )

  const setArtifactCount = useCallback((tokenId: string, newCount: number) => {
    const setters: Record<string, (count: number) => void> = {
      puppet: setPuppetCount,
      enhanced_puppet: setEnhancedPuppetCount,
      past_core: setPastCoreCount,
      future_core: setFutureCoreCount,
      castle_artifact: setCastleArtifactCount,
      attack_artifact: setAttackArtifactCount,
      destroy_artifact_alpha: setDestroyArtifactAlphaCount,
      destroy_artifact_beta: setDestroyArtifactBetaCount,
      destroy_artifact_gamma: setDestroyArtifactGammaCount,
      exceed_artifact_omega: setExceedArtifactOmegaCount,
    }
    setters[tokenId]?.(newCount)
  }, [])

  const handleArtifactCountChange = useCallback(
    (tokenId: string, change: number) => {
      const currentCount = getArtifactCount(tokenId)
      const newCount = Math.max(0, currentCount + change)
      setArtifactCount(tokenId, newCount)

      if (change < 0 && currentCount > 0) {
        setHandCount((prev) => Math.max(0, prev - 1))
      }
    },
    [getArtifactCount, setArtifactCount],
  )

  useEffect(() => {
    setHandCount((prevHandCount) => Math.max(prevHandCount, totalKnownArtifacts))
  }, [totalKnownArtifacts])

  // --- Render ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)",
        color: "var(--mantine-color-blue-1)",
      }}
    >
      <Container size="xl" p="xl">
        <Grid gutter="xl">
          {/* 左側：ゲーム状況入力 */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card
              shadow="xl"
              withBorder
              p="lg"
              style={{
                backgroundColor: "var(--mantine-color-dark-8)",
                borderColor: "var(--mantine-color-blue-9)",
                position: "sticky",
                top: 20,
              }}
            >
              <Stack gap="lg">
                {/* ヘッダー */}
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="gradient" gradient={{ from: "blue.8", to: "blue.6" }} size="lg">
                      <IconBrain size={24} />
                    </ThemeIcon>
                    <Title order={2} c="blue.3">
                      対戦状況
                    </Title>
                  </Group>
                  <Tooltip label="全ての情報をリセット">
                    <ActionIcon variant="light" color="red" size="lg" radius="xl" onClick={resetGameStates}>
                      <IconRefresh size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                {/* リーダー選択 */}
                <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                  <Stack gap="sm">
                    <Text size="sm" c="blue.4" fw={500}>
                      リーダーと先後
                    </Text>
                    <Group>
                      <Card
                        withBorder
                        p="sm"
                        onClick={() => setIsLeaderModalOpened(true)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "var(--mantine-color-dark-6)",
                          borderColor: currentLeaderData
                            ? `var(--mantine-color-${currentLeaderData.color}-7)`
                            : "var(--mantine-color-blue-7)",
                          flex: 1,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Group gap="sm" justify="space-between">
                          <Group gap="xs">
                            {currentLeaderData && <Text size="lg">{currentLeaderData.icon}</Text>}
                            <Text size="sm" c="blue.2" fw={500}>
                              {currentLeaderData?.label || "リーダーを選択"}
                            </Text>
                          </Group>
                          <IconUsers size={20} color="var(--mantine-color-blue-4)" />
                        </Group>
                      </Card>
                    </Group>

                    <Radio.Group value={firstOrSecond} onChange={setFirstOrSecond}>
                      <Group gap="lg" justify="center">
                        <Radio
                          value="first"
                          label={
                            <Text c="blue.2" fw={500}>
                              先手
                            </Text>
                          }
                          color="blue"
                          size="md"
                        />
                        <Radio
                          value="second"
                          label={
                            <Text c="blue.2" fw={500}>
                              後手
                            </Text>
                          }
                          color="blue"
                          size="md"
                        />
                      </Group>
                    </Radio.Group>
                  </Stack>
                </Card>

                {/* ターン進行 */}
                <Button
                  onClick={advanceTurn}
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "blue.8", to: "blue.6" }}
                  leftSection={<IconClock size={20} />}
                  fullWidth
                >
                  次ターンへ進む
                </Button>

                {/* ゲーム状況 */}
                <Stack gap="md">
                  <DotSelector value={turn} max={10} onChange={handleTurnChange} label="ターン数" />

                  <DotSelector
                    value={handCount}
                    max={9}
                    onChange={(val: number) => {
                      setHandCount(Math.max(val, totalKnownArtifacts))
                    }}
                    label="相手の手札枚数"
                    knownCount={totalKnownArtifacts}
                    knownColor={leader === "elf" ? "green" : "cyan"}
                  />

                  <DotSelector
                    value={ppCurrent}
                    max={ppMax}
                    onChange={(val: number) => setPpCurrent(Math.min(val, ppMax))}
                    label={`現在のPP（上限: ${ppMax}）`}
                  />
                </Stack>

                {/* 特殊カウンター */}
                {leader === "nightmare" && (
                  <NumericCounter
                    value={graveyardCount}
                    onChange={setGraveyardCount}
                    label="墓地枚数"
                    min={0}
                    icon={<IconHistory size={16} />}
                  />
                )}

                {/* 特殊能力 */}
                <Stack gap="sm">
                  {leader === "dragon" && (
                    <Group grow>
                      <Button
                        onClick={handlePpMaxIncrease}
                        size="sm"
                        variant="light"
                        color="blue"
                        leftSection={<IconPlus size={16} />}
                      >
                        PP上限+1
                      </Button>
                      <Button
                        onClick={handlePpMaxDecrease}
                        color="red"
                        size="sm"
                        variant="light"
                        leftSection={<IconMinus size={16} />}
                      >
                        PP上限-1
                      </Button>
                    </Group>
                  )}

                  {firstOrSecond === "second" && (
                    <Switch
                      label={
                        <Text c="blue.2" fw={500}>
                          エクストラPP使用
                        </Text>
                      }
                      checked={turnPpBonus === 1}
                      color="blue"
                      size="md"
                      onChange={(e) => {
                        const checked = e.currentTarget.checked
                        setTurnPpBonus(checked ? 1 : 0)
                        setPpCurrent((prev) => Math.min(prev + (checked ? 1 : -1), ppMax))
                        setExtraPPUsedThisTurn(!checked)
                      }}
                    />
                  )}
                </Stack>

                {/* EP/SEP */}
                <Grid>
                  <Grid.Col span={6}>
                    <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                      <Stack gap="sm">
                        <DotSelector
                          value={ep}
                          max={2}
                          onChange={setEp}
                          disabled={!isEpUsable || evolveUsedThisTurn}
                          label="EP"
                        />
                        <Button
                          onClick={() => {
                            setEp((v) => Math.max(0, v - 1))
                            setEvolveUsedThisTurn(true)
                          }}
                          disabled={ep === 0 || evolveUsedThisTurn || !isEpUsable}
                          size="sm"
                          variant="light"
                          color="yellow"
                          fullWidth
                        >
                          進化使用
                        </Button>
                      </Stack>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                      <Stack gap="sm">
                        <DotSelector
                          value={sep}
                          max={2}
                          onChange={setSep}
                          disabled={!isSepUsable || evolveUsedThisTurn}
                          label="SEP"
                        />
                        <Button
                          onClick={() => {
                            setSep((v) => Math.max(0, v - 1))
                            setEvolveUsedThisTurn(true)
                          }}
                          disabled={sep === 0 || evolveUsedThisTurn || !isSepUsable}
                          size="sm"
                          variant="light"
                          color="violet"
                          fullWidth
                        >
                          超進化使用
                        </Button>
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Grid.Col>

          {/* 右側：分析・管理エリア */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card
              shadow="xl"
              withBorder
              p="lg"
              style={{
                backgroundColor: "var(--mantine-color-dark-8)",
                borderColor: "var(--mantine-color-blue-9)",
              }}
            >
              <Tabs defaultValue="removal" color="blue">
                <Tabs.List grow>
                  <Tabs.Tab
                    value="removal"
                    leftSection={<IconSword size={18} />}
                    styles={{
                      tab: {
                        color: "var(--mantine-color-blue-2)",
                        fontSize: "14px",
                        fontWeight: 500,
                      },
                    }}
                  >
                    除去カード
                    {filteredCards.length > 0 && (
                      <Badge size="xs" color="blue" variant="light" ml="xs">
                        {filteredCards.length}
                      </Badge>
                    )}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="tokens"
                    leftSection={<IconShield size={18} />}
                    styles={{
                      tab: {
                        color: "var(--mantine-color-blue-2)",
                        fontSize: "14px",
                        fontWeight: 500,
                      },
                    }}
                  >
                    トークン管理
                    {totalKnownArtifacts > 0 && (
                      <Badge size="xs" color="cyan" variant="light" ml="xs">
                        {totalKnownArtifacts}
                      </Badge>
                    )}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="strong_moves"
                    leftSection={<IconTrendingUp size={18} />}
                    styles={{
                      tab: {
                        color: "var(--mantine-color-blue-2)",
                        fontSize: "14px",
                        fontWeight: 500,
                      },
                    }}
                  >
                    強い動き
                    {currentStrongMoves.length > 0 && (
                      <Badge size="xs" color="orange" variant="light" ml="xs">
                        {currentStrongMoves.length}
                      </Badge>
                    )}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="history"
                    leftSection={<IconHistory size={18} />}
                    styles={{
                      tab: {
                        color: "var(--mantine-color-blue-2)",
                        fontSize: "14px",
                        fontWeight: 500,
                      },
                    }}
                  >
                    履歴
                    {gameHistory.length > 0 && (
                      <Badge size="xs" color="gray" variant="light" ml="xs">
                        {gameHistory.length}
                      </Badge>
                    )}
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="removal" pt="lg">
                  <Stack gap="lg">
                    <Group justify="space-between" align="center">
                      <Title order={3} c="blue.3">
                        使用可能な除去カード
                      </Title>
                      {filteredCards.length > 0 && (
                        <Badge variant="light" color="blue" size="lg">
                          {filteredCards.length}枚利用可能
                        </Badge>
                      )}
                    </Group>

                    {leader === null ? (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="リーダーを選択してください"
                        color="blue"
                        variant="light"
                      >
                        除去カードを表示するには、まずリーダーを選択してください。
                      </Alert>
                    ) : handCount === 0 ? (
                      <Alert icon={<IconCards size={16} />} title="手札がありません" color="orange" variant="light">
                        相手の手札が0枚のため、除去カードは使用できません。
                      </Alert>
                    ) : filteredCards.length === 0 ? (
                      <Alert
                        icon={<IconX size={16} />}
                        title="使用可能な除去カードがありません"
                        color="gray"
                        variant="light"
                      >
                        現在のPPと状況では使用可能な除去カードがありません。
                      </Alert>
                    ) : (
                      <ScrollArea h={600}>
                        <Grid gutter="md">
                          {filteredCards.map((card) => (
                            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }} key={card.id}>
                              <RemovalCardBlock
                                card={card}
                                ppCurrent={ppCurrent}
                                ppMax={ppMax}
                                onUseCard={handleUseCard}
                                actionableEffect={card.actionableEffect}
                              />
                            </Grid.Col>
                          ))}
                        </Grid>
                      </ScrollArea>
                    )}
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="tokens" pt="lg">
                  <Stack gap="lg">
                    <Group justify="space-between" align="center">
                      <Title order={3} c="blue.3">
                        トークン・特殊効果管理
                      </Title>
                      {totalKnownArtifacts > 0 && (
                        <Badge variant="light" color="cyan" size="lg">
                          {totalKnownArtifacts}枚確定
                        </Badge>
                      )}
                    </Group>

                    {leader === null ? (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="リーダーを選択してください"
                        color="blue"
                        variant="light"
                      >
                        トークン管理機能を使用するには、まずリーダーを選択してください。
                      </Alert>
                    ) : leader === "elf" ? (
                      <Stack gap="md">
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                          <Stack gap="sm">
                            <Group justify="space-between">
                              <Group>
                                <ThemeIcon variant="light" color="green" size="lg">
                                  <IconSparkles size={20} />
                                </ThemeIcon>
                                <Text size="lg" c="green.4" fw={600}>
                                  フェアリートークン
                                </Text>
                              </Group>
                              <Badge color="green" variant="light" size="lg">
                                {fairyCount}枚
                              </Badge>
                            </Group>

                            <Divider />

                            <Text size="sm" c="green.3">
                              <strong>効果:</strong> 1コスト 1/1 【突進】
                            </Text>

                            <DotSelector
                              value={fairyCount}
                              max={handCount}
                              onChange={(val: number) => setFairyCount(Math.min(val, handCount))}
                              label="確定フェアリー数"
                              knownColor="green"
                            />
                          </Stack>
                        </Card>
                      </Stack>
                    ) : leader === "nemesis" ? (
                      <Stack gap="lg">
                        {/* 操り人形セクション */}
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                          <Stack gap="sm">
                            <Group>
                              <ThemeIcon variant="light" color="cyan" size="lg">
                                <IconBoxMultiple size={20} />
                              </ThemeIcon>
                              <Text size="lg" c="cyan.4" fw={600}>
                                操り人形トークン
                              </Text>
                            </Group>
                            <Grid gutter="sm">
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "puppet")!}
                                  count={puppetCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "enhanced_puppet")!}
                                  count={enhancedPuppetCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                            </Grid>
                          </Stack>
                        </Card>

                        {/* コア・アーティファクトセクション */}
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                          <Stack gap="sm">
                            <Group>
                              <ThemeIcon variant="light" color="cyan" size="lg">
                                <IconBoxMultiple size={20} />
                              </ThemeIcon>
                              <Text size="lg" c="cyan.4" fw={600}>
                                コア・アーティファクト
                              </Text>
                            </Group>
                            <Grid gutter="sm">
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "past_core")!}
                                  count={pastCoreCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "future_core")!}
                                  count={futureCoreCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "castle_artifact")!}
                                  count={castleArtifactCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "attack_artifact")!}
                                  count={attackArtifactCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                            </Grid>
                          </Stack>
                        </Card>

                        {/* デストロイアーティファクトセクション */}
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                          <Stack gap="sm">
                            <Group>
                              <ThemeIcon variant="light" color="orange" size="lg">
                                <IconFlame size={20} />
                              </ThemeIcon>
                              <Text size="lg" c="orange.4" fw={600}>
                                デストロイアーティファクト
                              </Text>
                            </Group>
                            <Grid gutter="sm">
                              <Grid.Col span={4}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "destroy_artifact_alpha")!}
                                  count={destroyArtifactAlphaCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "destroy_artifact_beta")!}
                                  count={destroyArtifactBetaCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                              <Grid.Col span={4}>
                                <NemesisTokenCard
                                  token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "destroy_artifact_gamma")!}
                                  count={destroyArtifactGammaCount}
                                  handleArtifactCountChange={handleArtifactCountChange}
                                  handCount={handCount}
                                />
                              </Grid.Col>
                            </Grid>
                          </Stack>
                        </Card>

                        {/* 最終アーティファクト */}
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                          <Stack gap="sm">
                            <Group>
                              <ThemeIcon variant="light" color="violet" size="lg">
                                <IconTarget size={20} />
                              </ThemeIcon>
                              <Text size="lg" c="violet.4" fw={600}>
                                最終アーティファクト
                              </Text>
                            </Group>
                            <NemesisTokenCard
                              token={NEMESIS_ARTIFACT_TOKENS.find((t) => t.id === "exceed_artifact_omega")!}
                              count={exceedArtifactOmegaCount}
                              handleArtifactCountChange={handleArtifactCountChange}
                              handCount={handCount}
                            />
                          </Stack>
                        </Card>

                        {/* 合成ボタンセクション */}
                        <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-6)" }}>
                          <Stack gap="md">
                            <Group>
                              <ThemeIcon variant="gradient" gradient={{ from: "teal.8", to: "teal.6" }} size="lg">
                                <IconBoxMultiple size={20} />
                              </ThemeIcon>
                              <Title order={4} c="teal.3">
                                アーティファクト合成
                              </Title>
                            </Group>

                            <Text size="sm" c="teal.4">
                              素材を組み合わせて上位アーティファクトを生成
                            </Text>

                            <Grid gutter="sm">
                              <Grid.Col span={6}>
                                <Button
                                  onClick={() => {
                                    /* 合成モーダル処理 */
                                  }}
                                  disabled={!(pastCoreCount >= 2 || (pastCoreCount >= 1 && futureCoreCount >= 1))}
                                  size="sm"
                                  variant="gradient"
                                  gradient={{ from: "teal.8", to: "teal.6" }}
                                  leftSection={<IconBoxMultiple size={16} />}
                                  fullWidth
                                >
                                  キャッスル合成
                                </Button>
                              </Grid.Col>
                              <Grid.Col span={6}>
                                <Button
                                  onClick={() => {
                                    /* 合成モーダル処理 */
                                  }}
                                  disabled={!(futureCoreCount >= 2 || (pastCoreCount >= 1 && futureCoreCount >= 1))}
                                  size="sm"
                                  variant="gradient"
                                  gradient={{ from: "teal.8", to: "teal.6" }}
                                  leftSection={<IconBoxMultiple size={16} />}
                                  fullWidth
                                >
                                  アタック合成
                                </Button>
                              </Grid.Col>
                            </Grid>

                            <Progress
                              value={Math.min(100, ((pastCoreCount + futureCoreCount) / 4) * 100)}
                              color="teal"
                              size="sm"
                              label="合成進捗"
                            />
                          </Stack>
                        </Card>
                      </Stack>
                    ) : (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="このリーダーには特定のトークン管理機能はありません"
                        color="blue"
                        variant="light"
                      >
                        {currentLeaderData?.label}
                        には専用のトークン管理機能はありませんが、下記のメモ欄をご活用ください。
                      </Alert>
                    )}

                    {/* 共通メモエリア */}
                    <Card withBorder p="md" style={{ backgroundColor: "var(--mantine-color-dark-7)" }}>
                      <Stack gap="sm">
                        <Group>
                          <ThemeIcon variant="light" color="blue" size="lg">
                            <IconHistory size={20} />
                          </ThemeIcon>
                          <Text size="lg" c="blue.4" fw={600}>
                            特殊効果メモ
                          </Text>
                        </Group>
                        <Textarea
                          placeholder="生成されたトークンや特殊効果について記録..."
                          value={tokenNotes}
                          onChange={(e) => setTokenNotes(e.currentTarget.value)}
                          minRows={4}
                          maxRows={8}
                          autosize
                          styles={{
                            input: {
                              backgroundColor: "var(--mantine-color-dark-6)",
                              color: "var(--mantine-color-blue-2)",
                              border: "1px solid var(--mantine-color-dark-4)",
                            },
                          }}
                        />
                      </Stack>
                    </Card>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="strong_moves" pt="lg">
                  <Stack gap="lg">
                    <Group justify="space-between" align="center">
                      <Title order={3} c="blue.3">
                        相手の強い動き予測
                      </Title>
                      {currentStrongMoves.length > 0 && (
                        <Badge variant="light" color="orange" size="lg">
                          {currentStrongMoves.length}個の脅威
                        </Badge>
                      )}
                    </Group>

                    {leader === null ? (
                      <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="リーダーを選択してください"
                        color="blue"
                        variant="light"
                      >
                        強い動きの予測を表示するには、まずリーダーを選択してください。
                      </Alert>
                    ) : currentStrongMoves.length === 0 ? (
                      <Alert
                        icon={<IconCheck size={16} />}
                        title="現在警戒すべき動きはありません"
                        color="green"
                        variant="light"
                      >
                        このターン周辺で特に警戒すべき強い動きは記録されていません。
                      </Alert>
                    ) : (
                      <Stack gap="md">
                        {currentStrongMoves.map((move, i) => (
                          <Card
                            key={i}
                            withBorder
                            p="md"
                            style={{
                              backgroundColor: "var(--mantine-color-dark-7)",
                              borderColor: `var(--mantine-color-${THREAT_COLORS[move.threat as keyof typeof THREAT_COLORS]}-6)`,
                            }}
                          >
                            <Group justify="space-between" align="flex-start">
                              <Stack gap="xs" style={{ flex: 1 }}>
                                <Group>
                                  <Badge variant="light" color="blue" size="lg">
                                    ターン {move.turn}
                                  </Badge>
                                  <ThreatBadge threat={move.threat as keyof typeof THREAT_COLORS} />
                                </Group>
                                <Text size="sm" c="blue.2" fw={500}>
                                  {move.move}
                                </Text>
                              </Stack>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="lg">
                  <Stack gap="lg">
                    <Group justify="space-between" align="center">
                      <Title order={3} c="blue.3">
                        ゲーム履歴
                      </Title>
                      {gameHistory.length > 0 && (
                        <Badge variant="light" color="gray" size="lg">
                          {gameHistory.length}件の記録
                        </Badge>
                      )}
                    </Group>

                    {gameHistory.length === 0 ? (
                      <Alert icon={<IconHistory size={16} />} title="履歴がありません" color="gray" variant="light">
                        ゲームの進行やカードの使用履歴がここに表示されます。
                      </Alert>
                    ) : (
                      <ScrollArea h={500}>
                        <Stack gap="xs">
                          {gameHistory
                            .slice(-30)
                            .reverse()
                            .map((entry, i) => (
                              <Card
                                key={i}
                                withBorder
                                p="sm"
                                style={{ backgroundColor: "var(--mantine-color-dark-7)" }}
                              >
                                <Group justify="space-between" align="center">
                                  <Group>
                                    <Badge variant="light" color="blue" size="sm">
                                      T{entry.turn}
                                    </Badge>
                                    <Text size="sm" c="blue.4">
                                      {entry.action}
                                    </Text>
                                  </Group>
                                  <Group gap="xs">
                                    <Badge variant="outline" color="blue" size="xs">
                                      PP:{entry.pp}
                                    </Badge>
                                    <Badge variant="outline" color="cyan" size="xs">
                                      手札:{entry.hand}
                                    </Badge>
                                  </Group>
                                </Group>
                              </Card>
                            ))}
                        </Stack>
                      </ScrollArea>
                    )}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* リーダー選択モーダル */}
      <Modal
        opened={isLeaderModalOpened}
        onClose={() => setIsLeaderModalOpened(false)}
        title={
          <Group>
            <ThemeIcon variant="gradient" gradient={{ from: "blue.8", to: "blue.6" }} size="lg">
              <IconUsers size={24} />
            </ThemeIcon>
            <Title order={3} c="blue.3">
              リーダーを選択
            </Title>
          </Group>
        }
        centered
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: { backgroundColor: "var(--mantine-color-dark-8)", borderColor: "var(--mantine-color-blue-9)" },
          header: {
            backgroundColor: "var(--mantine-color-dark-8)",
            borderBottom: "1px solid var(--mantine-color-dark-6)",
          },
          title: { color: "var(--mantine-color-blue-3)" },
          close: { color: "var(--mantine-color-blue-3)" },
        }}
      >
        <Stack gap="md">
          <Text c="blue.4" size="sm">
            対戦相手のリーダークラスを選択してください。選択後、そのクラス専用の機能が利用可能になります。
          </Text>
          <Grid gutter="md">
            {LEADERS.map((leaderOption) => (
              <Grid.Col span={6} key={leaderOption.value}>
                <Card
                  shadow="sm"
                  withBorder
                  p="lg"
                  onClick={() => {
                    const newLeader = leaderOption.value
                    setLeader(newLeader)
                    resetGameStates()
                    setIsLeaderModalOpened(false)
                  }}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      leaderOption.value === leader
                        ? `var(--mantine-color-${leaderOption.color}-9)`
                        : "var(--mantine-color-dark-7)",
                    borderColor:
                      leaderOption.value === leader
                        ? `var(--mantine-color-${leaderOption.color}-7)`
                        : "var(--mantine-color-dark-5)",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Stack gap="sm" align="center">
                    <Text size="2xl">{leaderOption.icon}</Text>
                    <Text size="lg" fw={700} c={leaderOption.value === leader ? "white" : "blue.2"}>
                      {leaderOption.label}
                    </Text>
                    {leaderOption.value === leader && (
                      <Badge color={leaderOption.color} variant="light">
                        選択中
                      </Badge>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Modal>
    </div>
  )
}
