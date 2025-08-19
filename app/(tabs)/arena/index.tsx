import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Swords, Users, X, Search, Bell, Target, Gift, Plus, HelpCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/providers/UserProvider";
import { useGame } from "@/providers/GameProvider";
import { MOCK_DAILY_CHALLENGES, MOCK_NOTIFICATIONS, ACHIEVEMENTS, SEASON_DATA } from "@/constants/mockData";
import * as Haptics from "expo-haptics";

export default function ArenaScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { startDuel, searchMatch, isSearchingMatch } = useGame();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"1v1" | "team" | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleQuickDuel = async (mode: "1v1" | "team") => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedMode(mode);
    setIsSearching(true);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await searchMatch(mode);
      router.push("/duel");
    } catch (error) {
      console.error("Error starting match:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      startDuel("1v1", roomCode);
      setModalVisible(false);
      setRoomCode("");
      router.push("/duel");
    }
  };

  const handleCreateRoom = () => {
    router.push("/create-room");
  };

  const handleTutorial = () => {
    router.push("/tutorial");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#10B981", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >


        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.userName}>{user.nickname}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Liga</Text>
              <Text style={styles.statValue}>{user.league}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Nível</Text>
              <Text style={styles.statValue}>{user.level}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Moedas</Text>
              <Text style={styles.statValue}>{user.coins}</Text>
            </View>
          </View>
          
          {/* Win Streak Indicator */}
          {user.winStreak > 0 && (
            <View style={styles.winStreakContainer}>
              <Text style={styles.winStreakText}>🔥 Sequência: {user.winStreak} vitórias</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>🎮 Pronto para Duelar?</Text>
          <Text style={styles.welcomeText}>
            Escolha um modo de jogo abaixo para começar sua jornada no Duelo Metabólico!
          </Text>
          
          {/* Season Progress */}
          <View style={styles.seasonProgress}>
            <Text style={styles.seasonTitle}>⚡ {SEASON_DATA.current.name}</Text>
            <View style={styles.seasonBar}>
              <View style={[styles.seasonFill, { width: `${Math.min(100, Math.max(0, (user.seasonTier / 20) * 100))}%` }]} />
            </View>
            <Text style={styles.seasonText}>Tier {user.seasonTier}/20</Text>
          </View>
          
        </View>
        
        <Text style={styles.sectionTitle}>Modos de Jogo</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            testID="quick-duel-1v1"
            style={styles.modeCard}
            onPress={() => handleQuickDuel("1v1")}
            disabled={isSearching || isSearchingMatch}
          >
            <LinearGradient
              colors={["#8B5CF6", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modeGradient}
            >
              <Swords color="white" size={32} />
              <View style={styles.modeInfo}>
                <Text style={styles.modeTitle}>Duelo 1 vs 1</Text>
                <Text style={styles.modeDescription}>
                  Confronto direto com outro nutricionista
                </Text>
                <Text style={styles.modeSubtext}>
                  🔥 Partida rápida - 5 fases estratégicas
                </Text>
              </View>
              {(isSearching || isSearchingMatch) && selectedMode === "1v1" && (
                <View style={styles.searchingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.searchingText}>Procurando...</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          testID="quick-duel-team"
          style={styles.modeCard}
          onPress={() => handleQuickDuel("team")}
          disabled={isSearching || isSearchingMatch}
        >
          <LinearGradient
            colors={["#F59E0B", "#EF4444"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modeGradient}
          >
            <Users color="white" size={32} />
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Desafio de Equipes</Text>
              <Text style={styles.modeDescription}>
                Competição 2 vs 2 com colaboração
              </Text>
              <Text style={styles.modeSubtext}>
                🤝 Chat em equipe - Estratégia colaborativa
              </Text>
            </View>
            {(isSearching || isSearchingMatch) && selectedMode === "team" && (
              <View style={styles.searchingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.searchingText}>Procurando...</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.roomActions}>
          <TouchableOpacity
            testID="create-room"
            style={styles.roomActionCard}
            onPress={handleCreateRoom}
          >
            <LinearGradient
              colors={["#06B6D4", "#0284C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roomActionGradient}
            >
              <Plus color="white" size={24} />
              <Text style={styles.roomActionText}>Criar Sala</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            testID="open-join-room"
            style={styles.roomActionCard}
            onPress={() => setModalVisible(true)}
          >
            <LinearGradient
              colors={["#06B6D4", "#0284C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roomActionGradient}
            >
              <Search color="white" size={24} />
              <Text style={styles.roomActionText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Online Players */}
        <View style={styles.onlineSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.sectionTitle}>Jogadores Online</Text>
            <Text style={styles.onlineCount}>1,247 online</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playersScroll}>
            {[
              { name: "Dr. Nutrição", league: "Diamante", status: "Em duelo" },
              { name: "MetaboMaster", league: "Platina", status: "Disponível" },
              { name: "VitaminaC", league: "Ouro", status: "Disponível" },
              { name: "ProteínaPro", league: "Prata", status: "Em duelo" },
              { name: "CarbControl", league: "Ouro", status: "Disponível" },
            ].map((player, index) => (
              <TouchableOpacity key={index} style={styles.playerCard}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerInitial}>{player.name[0]}</Text>
                </View>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerLeague}>{player.league}</Text>
                <View style={[styles.playerStatus, player.status === "Disponível" && styles.playerAvailable]}>
                  <Text style={styles.playerStatusText}>{player.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Challenges */}
        <View style={styles.challengesSection}>
          <View style={styles.sectionHeader}>
            <Target color="#10B981" size={20} />
            <Text style={styles.sectionTitle}>Desafios Diários</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.challengesScroll}>
            {MOCK_DAILY_CHALLENGES.map((challenge) => (
              <View key={challenge.id} style={[
                styles.challengeCard,
                challenge.completed && styles.challengeCompleted
              ]}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
                <View style={styles.challengeProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${Math.min(100, Math.max(0, (challenge.progress / challenge.target) * 100))}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {challenge.progress}/{challenge.target}
                  </Text>
                </View>
                <View style={styles.challengeReward}>
                  <Gift color="#F59E0B" size={16} />
                  <Text style={styles.rewardText}>+{challenge.reward} XP</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Notifications */}
        <View style={styles.notificationsSection}>
          <View style={styles.sectionHeader}>
            <Bell color="#8B5CF6" size={20} />
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>
          {MOCK_NOTIFICATIONS.slice(0, 2).map((notification) => (
            <View key={notification.id} style={[
              styles.notificationCard,
              !notification.read && styles.unreadNotification
            ]}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {notification.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Target color="#F59E0B" size={20} />
            <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {ACHIEVEMENTS.filter(a => Array.isArray(user.achievements) && user.achievements.includes(a.id)).slice(0, 3).map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementReward}>+{achievement.xpReward} XP</Text>
              </View>
            ))}
            {(!Array.isArray(user.achievements) || user.achievements.length === 0) && (
              <View style={styles.noAchievementsCard}>
                <Text style={styles.noAchievementsText}>🎯 Jogue para desbloquear conquistas!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>Estatísticas Rápidas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.wins || 0}</Text>
              <Text style={styles.statCardLabel}>Vitórias</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.maxWinStreak || 0}</Text>
              <Text style={styles.statCardLabel}>Melhor Sequência</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user.wins > 0 && (user.wins + user.losses) > 0 ? Math.round((user.wins / (user.wins + user.losses)) * 100) : 0}%
              </Text>
              <Text style={styles.statCardLabel}>Taxa de Vitória</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Entrar na Sala</Text>
            <Text style={styles.modalDescription}>
              Digite o código de 6 dígitos da sala
            </Text>
            
            <TextInput
              testID="room-code-input"
              style={styles.codeInput}
              value={roomCode}
              onChangeText={setRoomCode}
              placeholder="ABC123"
              placeholderTextColor="#9CA3AF"
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              testID="confirm-join-room"
              style={[
                styles.joinButton,
                roomCode.length !== 6 && styles.joinButtonDisabled,
              ]}
              onPress={handleJoinRoom}
              disabled={roomCode.length !== 6}
            >
              <Text style={styles.joinButtonText}>Entrar</Text>
            </TouchableOpacity>
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
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  helpButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  userInfo: {
    alignItems: "center",
  },
  welcomeText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  },
  userName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 15,
  },
  statBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  modeCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    gap: 20,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modeDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginTop: 4,
  },
  roomActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  roomActionCard: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roomActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    gap: 8,
  },
  roomActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  quickStats: {
    marginTop: 30,
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  statCardLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 25,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "600",
  },
  joinButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  joinButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  challengesSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  challengesScroll: {
    paddingLeft: 20,
  },
  challengeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: 280,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  challengeCompleted: {
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 15,
  },
  challengeProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },
  challengeReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },
  notificationsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unreadNotification: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 10,
  },
  modeSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 6,
    fontStyle: "italic",
  },
  searchingContainer: {
    alignItems: "center",
    gap: 4,
  },
  searchingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  onlineSection: {
    marginTop: 20,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  onlineCount: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: "auto",
  },
  playersScroll: {
    paddingLeft: 20,
  },
  playerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    width: 120,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  playerInitial: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  playerLeague: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 8,
  },
  playerStatus: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  playerAvailable: {
    backgroundColor: "#ECFDF5",
  },
  playerStatusText: {
    fontSize: 10,
    color: "#92400E",
    fontWeight: "500",
  },
  helpButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  helpButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  tutorialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: "flex-start",
    marginTop: 15,
    gap: 8,
  },
  tutorialButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  winStreakContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  winStreakText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  seasonProgress: {
    marginVertical: 15,
  },
  seasonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  seasonBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  seasonFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  seasonText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  achievementsSection: {
    marginTop: 20,
  },
  achievementsScroll: {
    paddingLeft: 20,
  },
  achievementCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    width: 120,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementReward: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "500",
  },
  noAchievementsCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 20,
    marginRight: 12,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  noAchievementsText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});