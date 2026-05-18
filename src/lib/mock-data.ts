// Mock data réaliste pour la plateforme Monitrix

export const OPERATORS = [
  { id: "1xbet", name: "1xBet", color: "hsl(var(--chart-1))" },
  { id: "melbet", name: "Melbet", color: "hsl(var(--chart-2))" },
  { id: "akwabet", name: "Akwabet", color: "hsl(var(--chart-3))" },
  { id: "betclic", name: "Betclic", color: "hsl(var(--chart-4))" },
  { id: "premierbet", name: "PremierBet", color: "hsl(var(--chart-5))" },
] as const;

export const PAYMENT_PLATFORMS = [
  { id: "freewan", name: "Freewan" },
  { id: "intouch", name: "InTouch" },
  { id: "paymetrust", name: "Paymetrust" },
  { id: "hub2", name: "Hub2" },
] as const;

export const GAME_TYPES = [
  "Live sports",
  "Pre events sports",
  "Lottery",
  "Casino",
  "Virtual Games",
  "Horse racing",
] as const;

export type BetStatus = "Won" | "Lost" | "Pending" | "Cancelled" | "Refunded" | "Cashout";
export type PaymentStatus = "Réussie" | "Échouée" | "En attente" | "Annulée";
export type KycStatus = "Vérifié" | "En attente" | "Rejeté";
export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertState = "open" | "acknowledged" | "closed";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: readonly T[]): T {
  return arr[rand(0, arr.length - 1)];
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString();
}

// Dashboard KPIs
export const dashboardKpis = {
  totalBets: 1284530,
  totalStakes: 8_540_120_000,
  totalPayout: 6_812_300_000,
  rjb: 1_727_820_000,
  openStake: 425_300_000,
  uniqueClients: 184_320,
  betsTax: 256_204_000,
  paymentTax: 408_738_000,
};

export const revenueByGameType = GAME_TYPES.map((g) => ({
  name: g,
  revenue: rand(80_000_000, 850_000_000),
}));

export const partnerSummary = OPERATORS.map((op) => ({
  ...op,
  bets: rand(120_000, 380_000),
  stakes: rand(800_000_000, 2_400_000_000),
  payout: rand(600_000_000, 2_000_000_000),
  tax: rand(20_000_000, 90_000_000),
  clients: rand(15_000, 60_000),
}));

// Betting
export const bettingKpis = {
  totalBets: 1284530,
  winRate: 42.8,
  averageStake: 6650,
  totalStakes: 8_540_120_000,
  wonBets: 549_780,
  lostBets: 715_120,
  averageOdds: 2.34,
  margin: 18.4,
};

export const stakeDistribution = GAME_TYPES.map((g) => ({ name: g, value: rand(100, 800) }));
export const clientsDistribution = GAME_TYPES.map((g) => ({ name: g, value: rand(50, 600) }));
export const openStakeDistribution = GAME_TYPES.map((g) => ({ name: g, value: rand(20, 400) }));

const BET_STATUSES: BetStatus[] = ["Won", "Lost", "Pending", "Cancelled", "Refunded", "Cashout"];

export const bets = Array.from({ length: 80 }, (_, i) => {
  const stake = rand(500, 250000);
  const status = pick(BET_STATUSES);
  const payout =
    status === "Won" ? stake * (rand(15, 50) / 10) : status === "Cashout" ? stake * 0.7 : 0;
  return {
    id: `BET-${100000 + i}`,
    ref: `OP-${rand(10000000, 99999999)}`,
    date: daysAgo(rand(0, 60)),
    operator: pick(OPERATORS),
    clientId: `CL-${rand(10000, 99999)}`,
    clientName: pick([
      "Mamadou Diouf",
      "Awa Ndiaye",
      "Cheikh Sarr",
      "Fatou Ba",
      "Ibrahima Sow",
      "Aissatou Fall",
      "Modou Cissé",
    ]),
    gameType: pick(GAME_TYPES),
    status,
    stake,
    payout: Math.round(payout),
    cashout: status === "Cashout",
    odds: rand(110, 800) / 100,
    selections: Array.from({ length: rand(1, 4) }, () => ({
      event: pick([
        "PSG vs OM",
        "Real Madrid vs Barça",
        "Sénégal vs Maroc",
        "Lakers vs Celtics",
        "Djokovic vs Alcaraz",
      ]),
      market: pick(["1X2", "Over/Under", "Both Teams to Score", "Handicap"]),
      pick: pick(["Home", "Draw", "Away", "Over 2.5", "Under 2.5"]),
      odds: rand(110, 350) / 100,
    })),
  };
});

// Payments
const PAYMENT_STATUSES: PaymentStatus[] = ["Réussie", "Échouée", "En attente", "Annulée"];

export const paymentsKpis = {
  totalTransactions: 845_120,
  totalAmount: 12_408_500_000,
  successful: 798_400,
  failed: 32_180,
  averageAmount: 14_680,
  successRate: 94.5,
};

export const payments = Array.from({ length: 80 }, (_, i) => {
  const status = pick(PAYMENT_STATUSES);
  return {
    id: `TXN-${200000 + i}`,
    date: daysAgo(rand(0, 60)),
    clientId: `CL-${rand(10000, 99999)}`,
    operator: pick(OPERATORS),
    platform: pick(PAYMENT_PLATFORMS),
    status,
    amount: rand(1000, 500000),
    type: pick(["Dépôt", "Retrait"] as const),
    method: pick(["Mobile Money", "Carte bancaire", "Virement", "Crypto"]),
    reference: `REF-${rand(100000000, 999999999)}`,
    processingTime: `${rand(1, 30)}s`,
    ip: `${rand(10, 254)}.${rand(0, 254)}.${rand(0, 254)}.${rand(0, 254)}`,
    location: pick(["Dakar, SN", "Thiès, SN", "Saint-Louis, SN", "Kaolack, SN", "Ziguinchor, SN"]),
    device: pick(["Android", "iOS", "Web"]),
  };
});

export const platformPerformance = PAYMENT_PLATFORMS.map((p) => ({
  name: p.name,
  volume: rand(800_000_000, 3_500_000_000),
  successRate: rand(88, 99),
  transactions: rand(80_000, 240_000),
}));

// Settlements & wallets
export const settlements = Array.from({ length: 24 }, (_, i) => ({
  id: `STL-${300000 + i}`,
  bookmaker: pick(OPERATORS),
  date: daysAgo(rand(0, 90)),
  amount: rand(50_000_000, 900_000_000),
  tax: rand(5_000_000, 90_000_000),
  commission: rand(1_000_000, 20_000_000),
  status: pick(["approuvé", "en_attente", "traité", "initié"] as const),
  bank: pick(["Ecobank", "CBAO", "SGBS", "BICIS"]),
}));

export const wallets = OPERATORS.map((op) => ({
  operator: op,
  balance: rand(150_000_000, 2_500_000_000),
  pending: rand(5_000_000, 80_000_000),
  active: true,
  transactions: rand(5000, 50000),
}));

// KYC
const KYC_STATUSES: KycStatus[] = ["Vérifié", "En attente", "Rejeté"];

export const kycUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `USR-${400000 + i}`,
  fullName: pick([
    "Mamadou Diouf",
    "Awa Ndiaye",
    "Cheikh Sarr",
    "Fatou Ba",
    "Ibrahima Sow",
    "Aissatou Fall",
    "Modou Cissé",
    "Marieme Diop",
    "Ousmane Ka",
  ]),
  phone: `+221 7${rand(0, 9)} ${rand(100, 999)} ${rand(10, 99)} ${rand(10, 99)}`,
  email: `user${i}@example.sn`,
  status: pick(KYC_STATUSES),
  documentType: pick(["Carte d'identité", "Passeport", "Permis de conduire"]),
  limit: rand(100_000, 5_000_000),
  verifiedBy: pick(["A. Diallo", "M. Sy", "F. Mbaye", "—"]),
  date: daysAgo(rand(0, 120)),
}));

// Taxes
export const taxKpis = {
  totalTax: 1_854_320_000,
  totalBets: 8_540_120_000,
  totalWins: 6_812_300_000,
  operatorRevenue: 1_727_820_000,
};

export const monthlyReversements = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
]
  .map((m) => ({
    month: m,
    playerWinsTax: rand(40_000_000, 180_000_000),
    operatorRevenueTax: rand(30_000_000, 120_000_000),
    total: 0,
    status: pick(["payée", "en_attente", "payée_automatique", "en_retard"] as const),
    paymentDate: daysAgo(rand(0, 365)),
  }))
  .map((r) => ({ ...r, total: r.playerWinsTax + r.operatorRevenueTax }));

export const invoices = Array.from({ length: 30 }, (_, i) => ({
  id: `INV-${500000 + i}`,
  month: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][
    i % 12
  ],
  operator: pick(OPERATORS),
  amount: rand(20_000_000, 250_000_000),
  status: pick([
    "payée_automatique",
    "payée",
    "en_attente",
    "en_attente_de_confirmation",
    "en_retard",
    "annulée",
  ] as const),
  date: daysAgo(rand(0, 200)),
}));

export const reversements = Array.from({ length: 25 }, (_, i) => ({
  id: `REV-${600000 + i}`,
  operator: pick(OPERATORS),
  amount: rand(30_000_000, 400_000_000),
  status: pick(["approuvé", "en_attente", "rejeté", "traité", "initié"] as const),
  date: daysAgo(rand(0, 120)),
  bank: pick(["Ecobank — SN0012...", "CBAO — SN0045...", "SGBS — SN0078..."]),
}));

// Audit
export const auditSummary = {
  bets: { toAudit: 12450, inProgressOk: 8120, suspicious: 240, suspect: 78, verified: 4012 },
  payments: { toAudit: 9820, inProgressOk: 6510, suspicious: 180, suspect: 42, verified: 3088 },
  progress: { betsVerified: 78, paymentsVerified: 82, regulatedClients: 91 },
  missing: { bets: 124, payments: 86 },
};

export const auditLogs = Array.from({ length: 40 }, (_, i) => ({
  id: `LOG-${700000 + i}`,
  date: daysAgo(rand(0, 30)),
  operator: pick(OPERATORS),
  type: pick(["Bet audit", "Payment audit", "KYC review", "Limit check"]),
  agent: pick(["A. Diallo", "M. Sy", "F. Mbaye"]),
  result: pick(["OK", "Douteux", "Suspect", "Vérifié"]),
  note: pick([
    "Vérification complétée.",
    "Anomalie sur ratio mise/gain.",
    "Identité confirmée.",
    "Document expiré.",
  ]),
}));

// Alerts
const SEVERITIES: AlertSeverity[] = ["low", "medium", "high", "critical"];
const STATES: AlertState[] = ["open", "acknowledged", "closed"];

export const alerts = Array.from({ length: 35 }, (_, i) => ({
  id: `ALT-${800000 + i}`,
  type: pick([
    "suspicious_betting_pattern",
    "underage_gambling_attempt",
    "money_laundering_suspicion",
  ] as const),
  severity: pick(SEVERITIES),
  state: pick(STATES),
  operator: pick(OPERATORS),
  clientId: `CL-${rand(10000, 99999)}`,
  date: daysAgo(rand(0, 30)),
  description: pick([
    "Pattern de mise anormalement répétitif détecté.",
    "Tentative présumée de jeu par mineur.",
    "Mouvements de fonds incohérents.",
    "Plusieurs dépôts/retraits rapprochés (smurfing).",
  ]),
}));

// Documents
export const documents = Array.from({ length: 18 }, (_, i) => ({
  id: `DOC-${900000 + i}`,
  name: pick([
    "Licence opérateur 2025.pdf",
    "Contrat de partenariat.pdf",
    "Rapport conformité Q3.pdf",
    "Audit fiscal annuel.pdf",
  ]),
  operator: pick(OPERATORS),
  type: pick(["Licence", "Contrat", "Rapport", "Audit"]),
  size: `${rand(120, 4800)} Ko`,
  uploadedAt: daysAgo(rand(0, 200)),
}));

// Users (settings)
export const adminUsers = [
  {
    id: "U001",
    name: "Aminata Diallo",
    email: "a.diallo@lonase.sn",
    role: "Admin",
    status: "Actif",
  },
  { id: "U002", name: "Moussa Sy", email: "m.sy@lonase.sn", role: "Gestionnaire", status: "Actif" },
  {
    id: "U003",
    name: "Fatou Mbaye",
    email: "f.mbaye@lonase.sn",
    role: "Analyste",
    status: "Actif",
  },
  {
    id: "U004",
    name: "Pape Ndour",
    email: "p.ndour@lonase.sn",
    role: "Support",
    status: "Inactif",
  },
];
