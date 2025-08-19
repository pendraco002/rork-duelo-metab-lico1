import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  Clock,
  Heart,
  Activity,
  AlertCircle,
  Send,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/providers/GameProvider";
import { useUser } from "@/providers/UserProvider";
import * as Haptics from "expo-haptics";
import { INTERVENTION_CARDS, POWER_CARDS } from "@/constants/interventionCards";

export default function DuelScreen() {
  const router = useRouter();
  const { currentGame, endDuel, opponentScore } = useGame();
  const { user, updateStats } = useUser();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [powerPoints, setPowerPoints] = useState(5);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [showPowers, setShowPowers] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentPhase]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextPhase();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  const handleNextPhase = () => {
    if (currentPhase < 5) {
      setCurrentPhase(currentPhase + 1);
      setSelectedCards([]); // Reset selections for next phase
      setTimeLeft(30);
    } else {
      handleEndDuel();
    }
  };

  const handleEndDuel = () => {
    const won = playerScore > opponentScore;
    updateStats(won, playerScore);
    endDuel();
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        won
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      );
    }
    
    router.back();
  };

  const selectCard = (cardId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentPhase === 2 || currentPhase === 4) {
      // For strategy and adaptation phases, only allow one selection
      setSelectedCards([cardId]);
      const basePoints = 15;
      const finalPoints = Math.floor(basePoints * comboMultiplier);
      setPlayerScore(playerScore + finalPoints);
      
      // Show combo effect if multiplier > 1
      if (comboMultiplier > 1) {
        setShowComboEffect(true);
        setTimeout(() => setShowComboEffect(false), 1500);
      }
    } else if (currentPhase === 3) {
      // For intervention phase, allow up to 3 cards
      if (selectedCards.includes(cardId)) {
        setSelectedCards(selectedCards.filter((id) => id !== cardId));
        setPlayerScore(Math.max(0, playerScore - 10));
      } else if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, cardId]);
        const basePoints = 10;
        const finalPoints = Math.floor(basePoints * comboMultiplier);
        setPlayerScore(playerScore + finalPoints);
        
        // Increase combo multiplier for consecutive good choices
        if (selectedCards.length === 2) {
          setComboMultiplier(1.5);
          setShowComboEffect(true);
          setTimeout(() => setShowComboEffect(false), 1500);
        }
      }
    }
  };

  const usePower = (powerId: string) => {
    const power = POWER_CARDS.find(p => p.id === powerId);
    if (!power || powerPoints < power.cost) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setPowerPoints(prev => prev - power.cost);
    setSelectedPowers([...selectedPowers, powerId]);
    setActiveEffects([...activeEffects, power.effect]);

    // Apply power effects
    switch (power.type) {
      case "attack":
        if (power.id === "time-pressure") {
          setTimeLeft(prev => Math.max(5, prev - 10));
        }
        break;
      case "boost":
        if (power.id === "expertise") {
          setPlayerScore(prev => prev + 15);
        }
        break;
    }

    setShowPowers(false);
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>Fase 1: Apresentação do Caso</Text>
            <Text style={styles.phaseInstruction}>
              📋 INSTRUÇÕES: Leia atentamente todas as informações do paciente. Analise os exames laboratoriais e o diagnóstico. Esta análise será fundamental para suas próximas decisões estratégicas.
            </Text>
            <View style={styles.caseCard}>
              <Text style={styles.patientName}>João Silva, 45 anos</Text>
              <Text style={styles.patientInfo}>IMC: 32.5 | Sedentário</Text>
              <View style={styles.diagnosisContainer}>
                <AlertCircle color="#EF4444" size={20} />
                <Text style={styles.diagnosis}>Diabetes Mellitus Tipo 2</Text>
              </View>
              <View style={styles.examResults}>
                <View style={styles.examItem}>
                  <Text style={styles.examLabel}>Glicemia</Text>
                  <Text style={styles.examValue}>180 mg/dL</Text>
                </View>
                <View style={styles.examItem}>
                  <Text style={styles.examLabel}>HbA1c</Text>
                  <Text style={styles.examValue}>8.5%</Text>
                </View>
                <View style={styles.examItem}>
                  <Text style={styles.examLabel}>Colesterol</Text>
                  <Text style={styles.examValue}>240 mg/dL</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleNextPhase}
            >
              <Text style={styles.continueButtonText}>Entendi o Caso - Continuar</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>Fase 2: Estratégia Inicial</Text>
            <Text style={styles.phaseInstruction}>
              🎯 INSTRUÇÕES: Selecione UMA estratégia principal clicando em uma das opções abaixo. Sua escolha definirá o foco do tratamento e influenciará as cartas de intervenção disponíveis na próxima fase.
            </Text>
            <View style={styles.strategyOptions}>
              <TouchableOpacity 
                style={[styles.strategyCard, selectedCards.includes('metabolic') && styles.selectedStrategy]}
                onPress={() => selectCard('metabolic')}
              >
                <Activity color="#10B981" size={32} />
                <Text style={styles.strategyTitle}>Foco Metabólico</Text>
                <Text style={styles.strategyDesc}>
                  Priorizar controle glicêmico
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.strategyCard, selectedCards.includes('cardiovascular') && styles.selectedStrategy]}
                onPress={() => selectCard('cardiovascular')}
              >
                <Heart color="#EF4444" size={32} />
                <Text style={styles.strategyTitle}>Foco Cardiovascular</Text>
                <Text style={styles.strategyDesc}>
                  Reduzir risco cardiovascular
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>Fase 3: Intervenções</Text>
            <Text style={styles.phaseInstruction}>
              💊 INSTRUÇÕES: Clique para selecionar ATÉ 3 cartas de intervenção nutricional. Cada carta tem pontuação diferente. Escolha as intervenções que melhor se adequam ao caso e à sua estratégia.
            </Text>
            <Text style={styles.selectionCounter}>
              Selecionadas: {selectedCards.length}/3
            </Text>
            <ScrollView style={styles.cardsContainer}>
              <View style={styles.cardsGrid}>
                {INTERVENTION_CARDS.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.interventionCard,
                      selectedCards.includes(card.id) && styles.selectedCard,
                    ]}
                    onPress={() => selectCard(card.id)}
                  >
                    <Text style={styles.cardTitle}>{card.name}</Text>
                    <Text style={styles.cardEffect}>{card.effect}</Text>
                    <View style={styles.cardPoints}>
                      <Text style={styles.pointsText}>+{card.points} pts</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 4:
        return (
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>Fase 4: Evento Adverso</Text>
            <Text style={styles.phaseInstruction}>
              ⚠️ INSTRUÇÕES: Um evento inesperado aconteceu! Leia a situação abaixo e escolha UMA das opções de adaptação. Sua flexibilidade será testada nesta fase.
            </Text>
            <View style={styles.eventCard}>
              <AlertCircle color="#F59E0B" size={32} />
              <Text style={styles.eventTitle}>Evento Inesperado!</Text>
              <Text style={styles.eventDescription}>
                O paciente relatou dificuldade em seguir a dieta durante viagem de trabalho
              </Text>
              <Text style={styles.eventQuestion}>
                Como você adapta sua estratégia?
              </Text>
            </View>
            <View style={styles.adaptOptions}>
              <TouchableOpacity 
                style={[styles.adaptCard, selectedCards.includes('planB') && styles.selectedAdapt]}
                onPress={() => selectCard('planB')}
              >
                <Text style={styles.adaptTitle}>Plano B</Text>
                <Text style={styles.adaptDesc}>
                  Criar opções práticas para viagens
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.adaptCard, selectedCards.includes('flexible') && styles.selectedAdapt]}
                onPress={() => selectCard('flexible')}
              >
                <Text style={styles.adaptTitle}>Flexibilizar</Text>
                <Text style={styles.adaptDesc}>
                  Ajustar metas temporariamente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>Fase 5: Resultados</Text>
            <Text style={styles.phaseInstruction}>
              🏆 RESULTADO: Duelo finalizado! Compare seu NutriScore com o do oponente. Analise o resumo da partida para aprender e melhorar nas próximas batalhas.
            </Text>
            <View style={styles.resultsContainer}>
              <View style={[styles.scoreCard, playerScore > opponentScore && styles.winnerCard]}>
                <Text style={styles.scoreLabel}>Seu NutriScore</Text>
                <Text style={[styles.scoreValue, playerScore > opponentScore && styles.winnerScore]}>{playerScore}</Text>
                {playerScore > opponentScore && <Text style={styles.winnerText}>🎉 VITÓRIA!</Text>}
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={[styles.scoreCard, opponentScore > playerScore && styles.winnerCard]}>
                <Text style={styles.scoreLabel}>{currentGame?.opponent || "Oponente"}</Text>
                <Text style={[styles.scoreValue, opponentScore > playerScore && styles.winnerScore]}>{opponentScore}</Text>
                {opponentScore > playerScore && <Text style={styles.winnerText}>😔 DERROTA</Text>}
              </View>
            </View>
            <View style={styles.resultsSummary}>
              <Text style={styles.summaryTitle}>Resumo da Partida:</Text>
              <Text style={styles.summaryText}>• Estratégia escolhida: {selectedCards.includes('metabolic') ? 'Foco Metabólico' : 'Foco Cardiovascular'}</Text>
              <Text style={styles.summaryText}>• Intervenções aplicadas: {selectedCards.length > 3 ? selectedCards.slice(-3).length : selectedCards.length}</Text>
              <Text style={styles.summaryText}>• XP ganho: +{playerScore}</Text>
            </View>
            <TouchableOpacity style={styles.finishButton} onPress={handleEndDuel}>
              <Text style={styles.finishButtonText}>Finalizar Duelo</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#10B981", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleEndDuel}>
          <X color="white" size={24} />
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <Clock color="white" size={20} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        <View style={styles.phaseIndicator}>
          {[1, 2, 3, 4, 5].map((phase) => (
            <View
              key={phase}
              style={[
                styles.phaseDot,
                phase === currentPhase && styles.phaseDotActive,
                phase < currentPhase && styles.phaseDotCompleted,
              ]}
            />
          ))}
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderPhaseContent()}
        
        {/* Combo Effect */}
        {showComboEffect && (
          <View style={styles.comboEffect}>
            <Text style={styles.comboText}>🔥 COMBO x{comboMultiplier.toFixed(1)}!</Text>
          </View>
        )}
      </Animated.View>

      {/* Power Button */}
      {currentPhase > 1 && currentPhase < 5 && (
        <TouchableOpacity
          style={styles.powerButton}
          onPress={() => setShowPowers(true)}
        >
          <Text style={styles.powerButtonText}>⚡ {powerPoints}</Text>
        </TouchableOpacity>
      )}

      {(currentPhase === 2 || currentPhase === 3 || currentPhase === 4) && (
        <TouchableOpacity
          style={[styles.nextButton, selectedCards.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNextPhase}
          disabled={selectedCards.length === 0}
        >
          <Text style={styles.nextButtonText}>
            {currentPhase === 2 ? "Confirmar Estratégia" : 
             currentPhase === 3 ? "Confirmar Jogada" : "Confirmar Adaptação"}
          </Text>
          <ChevronRight color="white" size={20} />
        </TouchableOpacity>
      )}

      {currentGame?.mode === "team" && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setShowChat(true)}
        >
          <Send color="white" size={20} />
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showChat}
        onRequestClose={() => setShowChat(false)}
      >
        <View style={styles.chatModal}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat da Equipe</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.chatMessages}>
            <Text style={styles.chatMessage}>
              Parceiro: Vamos focar no controle glicêmico primeiro!
            </Text>
          </ScrollView>
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.sendButton}>
              <Send color="white" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Powers Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPowers}
        onRequestClose={() => setShowPowers(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.powersModal}>
            <View style={styles.powersHeader}>
              <Text style={styles.powersTitle}>⚡ Poderes Disponíveis</Text>
              <Text style={styles.powerPointsText}>Pontos: {powerPoints}</Text>
              <TouchableOpacity onPress={() => setShowPowers(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.powersList}>
              <View style={styles.powersGrid}>
                {POWER_CARDS.map((power) => (
                  <TouchableOpacity
                    key={power.id}
                    style={[
                      styles.powerCard,
                      powerPoints < power.cost && styles.powerCardDisabled,
                      power.type === "attack" && styles.attackCard,
                      power.type === "defense" && styles.defenseCard,
                      power.type === "boost" && styles.boostCard,
                    ]}
                    onPress={() => usePower(power.id)}
                    disabled={powerPoints < power.cost}
                  >
                    <View style={styles.powerCardHeader}>
                      <Text style={styles.powerName}>{power.name}</Text>
                      <View style={styles.powerCost}>
                        <Text style={styles.powerCostText}>{power.cost}⚡</Text>
                      </View>
                    </View>
                    <Text style={styles.powerEffect}>{power.effect}</Text>
                    <Text style={styles.powerDescription}>{power.description}</Text>
                    {power.damage > 0 && (
                      <Text style={styles.powerDamage}>Dano: -{power.damage} pts</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  timerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  phaseIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  phaseDotActive: {
    backgroundColor: "white",
    width: 30,
  },
  phaseDotCompleted: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  phaseDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  caseCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  patientInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  diagnosisContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 8,
  },
  diagnosis: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
  examResults: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  examItem: {
    alignItems: "center",
  },
  examLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  examValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  strategyOptions: {
    gap: 15,
  },
  strategyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 10,
  },
  strategyDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  cardsContainer: {
    flex: 1,
  },
  cardsGrid: {
    gap: 10,
  },
  interventionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  cardEffect: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  cardPoints: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  eventCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
    marginTop: 10,
  },
  eventDescription: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
    marginTop: 10,
  },
  eventQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
    marginTop: 15,
  },
  adaptOptions: {
    gap: 10,
  },
  adaptCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
  },
  adaptTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  adaptDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  resultsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 40,
  },
  scoreCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10B981",
    marginTop: 10,
  },
  vsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6B7280",
  },
  finishButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 16,
    marginTop: 40,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  selectedStrategy: {
    borderWidth: 3,
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  selectedAdapt: {
    borderWidth: 2,
    borderColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
  },
  chatButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#8B5CF6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chatModal: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  chatMessages: {
    flex: 1,
    padding: 20,
  },
  chatMessage: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  chatInput: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#10B981",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  phaseInstruction: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 20,
    lineHeight: 26,
    backgroundColor: "#F0F9FF",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
    fontWeight: "500",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  selectionCounter: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: "#ECFDF5",
    padding: 8,
    borderRadius: 8,
  },
  winnerCard: {
    borderWidth: 3,
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  winnerScore: {
    color: "#059669",
  },
  winnerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    marginTop: 8,
  },
  resultsSummary: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
    lineHeight: 20,
  },
  powerButton: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  powerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  powersModal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  powersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  powersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  powerPointsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  powersList: {
    maxHeight: 400,
  },
  powersGrid: {
    gap: 12,
  },
  powerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  powerCardDisabled: {
    opacity: 0.5,
    backgroundColor: "#F3F4F6",
  },
  attackCard: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  defenseCard: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  boostCard: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  powerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  powerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  powerCost: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  powerCostText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  powerEffect: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 4,
  },
  powerDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  powerDamage: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
    marginTop: 4,
  },
  comboEffect: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  comboText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});