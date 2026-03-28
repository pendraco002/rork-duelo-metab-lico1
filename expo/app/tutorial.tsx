import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Swords, 
  Users, 
  Target, 
  Trophy,
  BookOpen,
  Zap
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const { width } = Dimensions.get("window");

const tutorialSteps = [
  {
    id: 1,
    title: "Bem-vindo ao Duelo Metabólico!",
    description: "Um jogo educacional onde você compete resolvendo casos clínicos de nutrição contra outros profissionais.",
    icon: Swords,
    color: "#10B981",
  },
  {
    id: 2,
    title: "Como Jogar - Passo a Passo",
    description: "1️⃣ Clique em 'Duelo 1v1' ou 'Desafio de Equipes'\n2️⃣ Aguarde encontrar um oponente\n3️⃣ Analise o caso clínico apresentado\n4️⃣ Faça suas escolhas estratégicas",
    icon: Users,
    color: "#8B5CF6",
  },
  {
    id: 3,
    title: "5 Fases do Duelo",
    description: "Fase 1: Leia o caso\nFase 2: Escolha estratégia\nFase 3: Selecione intervenções\nFase 4: Adapte-se a eventos\nFase 5: Veja os resultados",
    icon: Target,
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Cartas de Intervenção",
    description: "Cada carta tem pontuação diferente. Escolha até 3 cartas por fase. Exemplos: 'Contagem de Carboidratos' (+15 pts), 'Suplementar Ômega-3' (+10 pts).",
    icon: Zap,
    color: "#EF4444",
  },
  {
    id: 5,
    title: "NutriScore - Sistema de Pontuação",
    description: "Sua pontuação final é baseada na eficácia das suas escolhas. Maior pontuação = vitória! Ganhe XP para subir de nível.",
    icon: Trophy,
    color: "#06B6D4",
  },
  {
    id: 6,
    title: "Dicas para Vencer",
    description: "✨ Não é sobre velocidade, mas estratégia\n📚 Use a biblioteca para estudar\n🤝 Colabore no modo equipe\n🎯 Foque no contexto clínico",
    icon: BookOpen,
    color: "#84CC16",
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.back();
    }
  };

  const handlePrevious = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const currentTutorial = tutorialSteps[currentStep];
  const IconComponent = currentTutorial.icon;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        colors={[currentTutorial.color, "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconComponent color="white" size={80} />
          </View>

          <Text style={styles.title}>{currentTutorial.title}</Text>
          <Text style={styles.description}>{currentTutorial.description}</Text>

          <View style={styles.progressContainer}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft color={currentStep === 0 ? "#9CA3AF" : "white"} size={24} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              Anterior
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>
              {currentStep === tutorialSteps.length - 1 ? "Começar" : "Próximo"}
            </Text>
            <ChevronRight color="white" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Detailed Instructions */}
      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsContent}>
          <Text style={styles.detailsTitle}>Como Jogar:</Text>
          
          <View style={styles.quickStartCard}>
            <Text style={styles.quickStartTitle}>🚀 Início Rápido</Text>
            <Text style={styles.quickStartText}>1. Clique no botão 🔥 "Duelo 1 vs 1"</Text>
            <Text style={styles.quickStartText}>2. Aguarde encontrar um oponente (3-5 segundos)</Text>
            <Text style={styles.quickStartText}>3. Leia o caso clínico com atenção</Text>
            <Text style={styles.quickStartText}>4. Escolha sua estratégia (Metabólico ou Cardiovascular)</Text>
            <Text style={styles.quickStartText}>5. Selecione 3 cartas de intervenção</Text>
            <Text style={styles.quickStartText}>6. Adapte-se ao evento adverso</Text>
            <Text style={styles.quickStartText}>7. Veja seus resultados e ganhe XP!</Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>🎯</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Estratégia é Tudo</Text>
              <Text style={styles.stepDescription}>
                Não é um jogo de velocidade! Pense bem antes de escolher. Cada decisão afeta sua pontuação final.
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>📊</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Sistema de Pontuação</Text>
              <Text style={styles.stepDescription}>
                Cartas de alta pontuação (15 pts): Contagem de Carboidratos, Jejum Intermitente\nCartas médias (10-12 pts): Dieta DASH, Educação Nutricional
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>🤝</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Modo Equipe</Text>
              <Text style={styles.stepDescription}>
                No modo 2v2, use o chat para coordenar com seu parceiro. Discutam a estratégia antes de confirmar!
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>📚</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Aprenda Continuamente</Text>
              <Text style={styles.stepDescription}>
                Visite a Biblioteca para revisar casos anteriores e entender a fundamentação científica das decisões.
              </Text>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Dicas de Especialista:</Text>
            <Text style={styles.tipText}>• Leia TODO o caso antes de escolher a estratégia</Text>
            <Text style={styles.tipText}>• Cartas de maior pontuação nem sempre são as melhores</Text>
            <Text style={styles.tipText}>• Considere o perfil do paciente (idade, IMC, estilo de vida)</Text>
            <Text style={styles.tipText}>• No evento adverso, adapte-se à realidade do paciente</Text>
            <Text style={styles.tipText}>• Use o chat da equipe para discutir antes de decidir</Text>
            <Text style={styles.tipText}>• Pratique com casos da biblioteca para melhorar</Text>
          </View>

          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>❓ Perguntas Frequentes:</Text>
            <Text style={styles.faqQuestion}>Como criar uma sala privada?</Text>
            <Text style={styles.faqAnswer}>Clique em "Criar Sala" e compartilhe o código de 6 dígitos com seus amigos.</Text>
            
            <Text style={styles.faqQuestion}>Posso jogar offline?</Text>
            <Text style={styles.faqAnswer}>Não, o jogo requer conexão para matchmaking e sincronização de dados.</Text>
            
            <Text style={styles.faqQuestion}>Como subir de liga?</Text>
            <Text style={styles.faqAnswer}>Ganhe XP vencendo duelos. A cada 100 XP você sobe um nível e pode mudar de liga.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  gradient: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressDotActive: {
    backgroundColor: "white",
    width: 30,
  },
  progressDotCompleted: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#9CA3AF",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  detailsContent: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#15803D",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#166534",
    marginBottom: 8,
    lineHeight: 20,
  },
  quickStartCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 15,
  },
  quickStartText: {
    fontSize: 14,
    color: "#1E40AF",
    marginBottom: 8,
    lineHeight: 20,
  },
  faqContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginTop: 12,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
    marginBottom: 8,
  },
});