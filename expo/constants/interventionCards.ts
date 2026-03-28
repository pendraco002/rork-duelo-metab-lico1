export const INTERVENTION_CARDS = [
  {
    id: "card-1",
    name: "Contagem de Carboidratos",
    effect: "Melhora controle glicêmico",
    points: 15,
    category: "metabolic",
  },
  {
    id: "card-2",
    name: "Suplementação Ômega-3",
    effect: "Reduz triglicerídeos",
    points: 10,
    category: "cardiovascular",
  },
  {
    id: "card-3",
    name: "Dieta DASH",
    effect: "Reduz pressão arterial",
    points: 12,
    category: "cardiovascular",
  },
  {
    id: "card-4",
    name: "Jejum Intermitente",
    effect: "Melhora sensibilidade à insulina",
    points: 14,
    category: "metabolic",
  },
  {
    id: "card-5",
    name: "Fibras Solúveis",
    effect: "Reduz colesterol LDL",
    points: 8,
    category: "cardiovascular",
  },
  {
    id: "card-6",
    name: "Probióticos",
    effect: "Melhora microbiota intestinal",
    points: 7,
    category: "digestive",
  },
  {
    id: "card-7",
    name: "Dieta Low Carb",
    effect: "Reduz picos de glicemia",
    points: 13,
    category: "metabolic",
  },
  {
    id: "card-8",
    name: "Educação Nutricional",
    effect: "Aumenta adesão ao tratamento",
    points: 11,
    category: "behavioral",
  },
  {
    id: "card-9",
    name: "Plano de Refeições",
    effect: "Organiza rotina alimentar",
    points: 9,
    category: "behavioral",
  },
  {
    id: "card-10",
    name: "Suplementação Vitamina D",
    effect: "Melhora metabolismo ósseo",
    points: 6,
    category: "supplement",
  },
];

export const POWER_CARDS = [
  {
    id: "time-pressure",
    name: "⏰ Pressão do Tempo",
    effect: "Reduz tempo do oponente em 10s",
    damage: 5,
    cost: 2,
    type: "attack",
    description: "Cria urgência no atendimento, forçando decisões rápidas"
  },
  {
    id: "confusion",
    name: "🌀 Confusão de Dados",
    effect: "Embaralha informações do caso",
    damage: 8,
    cost: 3,
    type: "attack",
    description: "Gera dúvidas sobre os exames laboratoriais"
  },
  {
    id: "distraction",
    name: "📱 Distração",
    effect: "Bloqueia uma carta do oponente",
    damage: 10,
    cost: 4,
    type: "attack",
    description: "Interrupções impedem foco total no caso"
  },
  {
    id: "shield",
    name: "🛡️ Escudo Clínico",
    effect: "Protege contra próximo ataque",
    damage: 0,
    cost: 2,
    type: "defense",
    description: "Experiência clínica protege de interferências"
  },
  {
    id: "focus",
    name: "🎯 Foco Intenso",
    effect: "Dobra pontos da próxima jogada",
    damage: 0,
    cost: 3,
    type: "boost",
    description: "Concentração máxima no diagnóstico"
  },
  {
    id: "expertise",
    name: "🧠 Expertise",
    effect: "Ganha 15 pontos extras",
    damage: 0,
    cost: 4,
    type: "boost",
    description: "Conhecimento especializado em ação"
  },
];