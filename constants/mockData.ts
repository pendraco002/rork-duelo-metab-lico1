export const MOCK_RANKINGS = {
  individual: [
    { id: "1", nickname: "DrNutri", league: "Diamante", xp: 2450, trend: "up" },
    { id: "2", nickname: "MetaboMaster", league: "Diamante", xp: 2380, trend: "up" },
    { id: "3", nickname: "VitaminaC", league: "Platina", xp: 2150, trend: "down" },
    { id: "4", nickname: "ProteínaPro", league: "Platina", xp: 1980, trend: "up" },
    { id: "5", nickname: "CarbControl", league: "Ouro", xp: 1750, trend: "up" },
    { id: "user-1", nickname: "NutriMaster", league: "Ouro", xp: 650, trend: "up" },
    { id: "7", nickname: "FibraForte", league: "Ouro", xp: 1450, trend: "down" },
    { id: "8", nickname: "LipídeoLíder", league: "Prata", xp: 1200, trend: "up" },
  ],
  teams: [
    { id: "t1", name: "Equipe Alpha", league: "Diamante", xp: 4800 },
    { id: "t2", name: "Nutri Squad", league: "Platina", xp: 4200 },
    { id: "t3", name: "Meta Warriors", league: "Ouro", xp: 3500 },
  ],
};

export const MOCK_CASES = [
  {
    id: "case-1",
    patientName: "João Silva",
    diagnosis: "Diabetes Mellitus Tipo 2",
    date: "15/03/2024",
    result: "won",
    nutriScore: 85,
    interventions: [
      "Contagem de Carboidratos",
      "Suplementação com Ômega-3",
      "Plano Alimentar Low Carb",
    ],
  },
  {
    id: "case-2",
    patientName: "Maria Santos",
    diagnosis: "Hipertensão Arterial",
    date: "14/03/2024",
    result: "lost",
    nutriScore: 72,
    interventions: [
      "Dieta DASH",
      "Redução de Sódio",
      "Aumento de Potássio",
    ],
  },
  {
    id: "case-3",
    patientName: "Pedro Oliveira",
    diagnosis: "Dislipidemia",
    date: "13/03/2024",
    result: "won",
    nutriScore: 90,
    interventions: [
      "Dieta Mediterrânea",
      "Fibras Solúveis",
      "Fitosteróis",
    ],
  },
  {
    id: "case-4",
    patientName: "Ana Costa",
    diagnosis: "Obesidade Grau II",
    date: "12/03/2024",
    result: "won",
    nutriScore: 88,
    interventions: [
      "Déficit Calórico Controlado",
      "Reeducação Alimentar",
      "Jejum Intermitente",
    ],
  },
  {
    id: "case-5",
    patientName: "Carlos Mendes",
    diagnosis: "Síndrome Metabólica",
    date: "11/03/2024",
    result: "won",
    nutriScore: 92,
    interventions: [
      "Dieta Anti-inflamatória",
      "Exercício Físico Regular",
      "Controle de Estresse",
    ],
  },
  {
    id: "case-6",
    patientName: "Lucia Ferreira",
    diagnosis: "Anemia Ferropriva",
    date: "10/03/2024",
    result: "lost",
    nutriScore: 68,
    interventions: [
      "Suplementação de Ferro",
      "Vitamina C",
      "Alimentos Ricos em Ferro",
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Novo Desafio Disponível!",
    message: "Um novo caso clínico foi adicionado à biblioteca. Teste seus conhecimentos!",
    type: "challenge",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "notif-2",
    title: "Parabéns pela Vitória!",
    message: "Você venceu o duelo contra Dr. Nutrição com 85 pontos!",
    type: "victory",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: "notif-3",
    title: "Subiu de Liga!",
    message: "Parabéns! Você alcançou a Liga Ouro!",
    type: "achievement",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

export const MOCK_DAILY_CHALLENGES = [
  {
    id: "daily-1",
    title: "Especialista em Diabetes",
    description: "Vença 3 duelos focados em casos de diabetes",
    progress: 2,
    target: 3,
    reward: 50,
    coinReward: 25,
    completed: false,
  },
  {
    id: "daily-2",
    title: "Estrategista Cardiovascular",
    description: "Use 5 intervenções cardiovasculares diferentes",
    progress: 3,
    target: 5,
    reward: 30,
    coinReward: 15,
    completed: false,
  },
  {
    id: "daily-3",
    title: "Mentor Nutricional",
    description: "Ajude 2 colegas em duelos de equipe",
    progress: 2,
    target: 2,
    reward: 40,
    coinReward: 20,
    completed: true,
  },
];

export const SHOP_ITEMS = [
  {
    id: "power-pack-1",
    name: "Pacote de Poderes Básico",
    description: "5 poderes aleatórios para usar em duelos",
    price: 100,
    type: "power",
    rarity: "common",
    icon: "⚡",
  },
  {
    id: "power-pack-2",
    name: "Pacote de Poderes Premium",
    description: "3 poderes raros + 2 épicos garantidos",
    price: 250,
    type: "power",
    rarity: "rare",
    icon: "💎",
  },
  {
    id: "xp-boost",
    name: "Boost de XP (2h)",
    description: "Dobra o XP ganho por 2 horas",
    price: 50,
    type: "boost",
    rarity: "common",
    icon: "🚀",
  },
  {
    id: "coin-boost",
    name: "Boost de Moedas (2h)",
    description: "Dobra as moedas ganhas por 2 horas",
    price: 75,
    type: "boost",
    rarity: "common",
    icon: "💰",
  },
  {
    id: "avatar-frame-1",
    name: "Moldura Dourada",
    description: "Moldura dourada para seu avatar",
    price: 200,
    type: "cosmetic",
    rarity: "rare",
    icon: "🖼️",
  },
  {
    id: "title-master",
    name: "Título: Mestre Nutricional",
    description: "Título exclusivo para exibir no perfil",
    price: 300,
    type: "cosmetic",
    rarity: "epic",
    icon: "👑",
  },
];

export const ACHIEVEMENTS = [
  {
    id: "first-win",
    name: "Primeira Vitória",
    description: "Vença seu primeiro duelo",
    icon: "🏆",
    xpReward: 50,
    coinReward: 25,
    unlocked: true,
  },
  {
    id: "win-streak-5",
    name: "Sequência Imparável",
    description: "Vença 5 duelos seguidos",
    icon: "🔥",
    xpReward: 100,
    coinReward: 50,
    unlocked: true,
  },
  {
    id: "perfect-score",
    name: "Pontuação Perfeita",
    description: "Obtenha 100 pontos em um duelo",
    icon: "💯",
    xpReward: 75,
    coinReward: 40,
    unlocked: false,
  },
  {
    id: "power-master",
    name: "Mestre dos Poderes",
    description: "Use 50 poderes diferentes",
    icon: "⚡",
    xpReward: 150,
    coinReward: 75,
    unlocked: false,
  },
  {
    id: "league-champion",
    name: "Campeão da Liga",
    description: "Alcance a Liga Diamante",
    icon: "💎",
    xpReward: 500,
    coinReward: 250,
    unlocked: false,
  },
  {
    id: "case-collector",
    name: "Colecionador de Casos",
    description: "Complete 100 casos clínicos",
    icon: "📚",
    xpReward: 200,
    coinReward: 100,
    unlocked: false,
  },
];

export const SEASON_DATA = {
  current: {
    id: "season-1",
    name: "Temporada do Metabolismo",
    description: "Domine os segredos do metabolismo humano",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    rewards: [
      { tier: 1, xp: 100, reward: "Título: Aprendiz Metabólico", icon: "🎓" },
      { tier: 5, xp: 500, reward: "Pacote de Poderes Especiais", icon: "⚡" },
      { tier: 10, xp: 1000, reward: "Avatar Exclusivo", icon: "👤" },
      { tier: 15, xp: 2000, reward: "Moldura Lendária", icon: "🖼️" },
      { tier: 20, xp: 3000, reward: "Título: Mestre Metabólico", icon: "👑" },
    ],
  },
};

export const LEADERBOARD_DATA = [
  { rank: 1, name: "Dr. Nutrição", league: "Diamante", xp: 2450, wins: 89, avatar: "🥇" },
  { rank: 2, name: "MetaboMaster", league: "Diamante", xp: 2380, wins: 82, avatar: "🥈" },
  { rank: 3, name: "VitaminaC", league: "Platina", xp: 2200, wins: 76, avatar: "🥉" },
  { rank: 4, name: "ProteínaPro", league: "Platina", xp: 2150, wins: 71, avatar: "🏅" },
  { rank: 5, name: "CarbControl", league: "Platina", xp: 2100, wins: 68, avatar: "🏅" },
];