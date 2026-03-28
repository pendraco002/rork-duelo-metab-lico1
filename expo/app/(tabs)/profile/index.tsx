import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, Target, TrendingUp, Award, Settings, LogOut, Crown, Users, Star, X } from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { router } from "expo-router";
import { useSettings } from "@/providers/SettingsProvider";

export default function ProfileScreen() {
  const { user, logoutUser } = useUser();
  const settings = useSettings();
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const notificationsEnabled = settings.notificationsEnabled;
  const profilePublic = settings.profilePublic;
  
  // Mock ranking data
  const globalRanking = [
    { rank: 1, name: "Dr. Nutrição", league: "Diamante", xp: 2450, wins: 89 },
    { rank: 2, name: "MetaboMaster", league: "Diamante", xp: 2380, wins: 82 },
    { rank: 3, name: "VitaminaC", league: "Platina", xp: 2200, wins: 76 },
    { rank: 4, name: "ProteínaPro", league: "Platina", xp: 2150, wins: 71 },
    { rank: 5, name: "CarbControl", league: "Platina", xp: 2100, wins: 68 },
    { rank: 6, name: user.nickname, league: user.league, xp: user.xp, wins: user.wins },
    { rank: 7, name: "FibraForte", league: "Ouro", xp: 1950, wins: 62 },
    { rank: 8, name: "LipídioLord", league: "Ouro", xp: 1900, wins: 58 },
    { rank: 9, name: "CalciumKing", league: "Ouro", xp: 1850, wins: 55 },
    { rank: 10, name: "IronMaster", league: "Prata", xp: 1800, wins: 52 },
  ];
  
  const handleViewRanking = () => {
    setShowRanking(true);
  };
  
  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleSettings = () => {
    Alert.alert(
      "⚙️ Configurações",
      "Escolha uma opção para personalizar sua experiência:",
      [
        {
          text: "🔔 Notificações",
          onPress: () => {
            Alert.alert(
              "Notificações", 
              "• Duelos encontrados\n• Desafios diários\n• Conquistas desbloqueadas\n• Atualizações do ranking\n\n✅ Todas as notificações estão ativas",
              [{ text: "OK" }]
            );
          }
        },
        {
          text: "🎨 Tema",
          onPress: () => {
            Alert.alert(
              "Tema do Aplicativo", 
              "Escolha o tema visual:",
              [
                { text: "🌞 Claro (Atual)", onPress: () => Alert.alert("Tema", "Tema claro aplicado!") },
                { text: "🌙 Escuro", onPress: () => Alert.alert("Tema", "Tema escuro será implementado em breve!") },
                { text: "Cancelar", style: "cancel" }
              ]
            );
          }
        },
        {
          text: "🔒 Privacidade",
          onPress: () => {
            Alert.alert(
              "Privacidade e Segurança", 
              "• Perfil público: Visível para outros jogadores\n• Histórico de partidas: Privado\n• Dados pessoais: Protegidos\n• Compartilhamento: Apenas estatísticas básicas\n\n🔐 Seus dados estão seguros!",
              [{ text: "OK" }]
            );
          }
        },
        {
          text: "📊 Dados e Backup",
          onPress: () => {
            Alert.alert(
              "Gerenciar Dados", 
              "Escolha uma ação:",
              [
                { text: "☁️ Backup na Nuvem", onPress: () => Alert.alert("Backup", "Dados salvos com sucesso na nuvem!") },
                { text: "📥 Exportar Dados", onPress: () => Alert.alert("Exportar", "Dados exportados para Downloads!") },
                { text: "🗑️ Limpar Cache", onPress: () => Alert.alert("Cache", "Cache limpo com sucesso!") },
                { text: "Cancelar", style: "cancel" }
              ]
            );
          }
        },
        {
          text: "ℹ️ Sobre o App",
          onPress: () => {
            Alert.alert(
              "Duelo Metabólico", 
              "🎮 Versão 1.0.0\n\n📚 Desenvolvido especialmente para estudantes e profissionais de Nutrição\n\n🎯 Aprenda metabolismo de forma divertida e estratégica\n\n👥 Compete com outros nutricionistas\n\n🏆 Desenvolva habilidades clínicas\n\n💡 Criado por especialistas em educação nutricional",
              [{ text: "Fechar" }]
            );
          }
        },
        {
          text: "❌ Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja sair? Você precisará fazer login novamente.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            logoutUser();
            router.replace("/login");
          }
        }
      ]
    );
  };

  const achievements = [
    { id: 1, name: "Primeira Vitória", icon: Trophy, unlocked: true },
    { id: 2, name: "Sequência de 5", icon: TrendingUp, unlocked: true },
    { id: 3, name: "Mestre Estrategista", icon: Target, unlocked: false },
    { id: 4, name: "Campeão da Liga", icon: Award, unlocked: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={["#10B981", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.nickname.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.level}</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.coins}</Text>
          <Text style={styles.statLabel}>Moedas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.league}</Text>
          <Text style={styles.statLabel}>Liga</Text>
        </View>
      </View>

      {/* Progress to Next Level */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Progresso para o Próximo Nível</Text>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${Math.min(100, Math.max(0, Number.isFinite(user.xp) ? (user.xp % 100) : 0))}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>{Number.isFinite(user.xp) ? (user.xp % 100) : 0} / 100 XP</Text>
      </View>
      
      {/* Win Streak */}
      {user.winStreak > 0 && (
        <View style={styles.winStreakSection}>
          <Text style={styles.sectionTitle}>🔥 Sequência Atual</Text>
          <View style={styles.winStreakCard}>
            <Text style={styles.winStreakNumber}>{user.winStreak}</Text>
            <Text style={styles.winStreakLabel}>vitórias seguidas</Text>
            <Text style={styles.winStreakRecord}>Recorde: {user.maxWinStreak}</Text>
          </View>
        </View>
      )}

      {/* Battle Stats */}
      <View style={styles.battleStats}>
        <Text style={styles.sectionTitle}>Estatísticas de Batalha</Text>
        <View style={styles.battleStatsGrid}>
          <View style={styles.battleStatItem}>
            <Text style={styles.battleStatValue}>{user.wins + user.losses}</Text>
            <Text style={styles.battleStatLabel}>Partidas Jogadas</Text>
          </View>
          <View style={styles.battleStatItem}>
            <Text style={[styles.battleStatValue, { color: "#10B981" }]}>
              {user.wins}
            </Text>
            <Text style={styles.battleStatLabel}>Vitórias</Text>
          </View>
          <View style={styles.battleStatItem}>
            <Text style={[styles.battleStatValue, { color: "#F59E0B" }]}>
              {user.totalGamesPlayed}
            </Text>
            <Text style={styles.battleStatLabel}>Total de Jogos</Text>
          </View>
          <View style={styles.battleStatItem}>
            <Text style={styles.battleStatValue}>
              {(user.wins + user.losses) > 0 ? Math.round((user.wins / (user.wins + user.losses)) * 100) : 0}%
            </Text>
            <Text style={styles.battleStatLabel}>Taxa de Vitória</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  !achievement.unlocked && styles.achievementLocked,
                ]}
              >
                <Icon
                  color={achievement.unlocked ? "#10B981" : "#D1D5DB"}
                  size={32}
                />
                <Text
                  style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.achievementNameLocked,
                  ]}
                >
                  {achievement.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewRanking}>
          <Crown color="#F59E0B" size={24} />
          <Text style={styles.actionButtonText}>Ranking Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleOpenSettings}>
          <Settings color="#6B7280" size={24} />
          <Text style={styles.actionButtonText}>Configurações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <LogOut color="#EF4444" size={24} />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Ranking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRanking}
        onRequestClose={() => setShowRanking(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 Ranking Global</Text>
              <TouchableOpacity onPress={() => setShowRanking(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.rankingList}>
              {globalRanking.map((player) => (
                <View 
                  key={player.rank} 
                  style={[
                    styles.rankingItem,
                    player.name === user.nickname && styles.currentUserRank
                  ]}
                >
                  <View style={styles.rankInfo}>
                    <View style={[
                      styles.rankBadge,
                      player.rank <= 3 && styles.topRankBadge
                    ]}>
                      <Text style={[
                        styles.rankNumber,
                        player.rank <= 3 && styles.topRankNumber
                      ]}>#{player.rank}</Text>
                    </View>
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerLeague}>{player.league}</Text>
                    </View>
                  </View>
                  <View style={styles.playerStats}>
                    <Text style={styles.playerXP}>{player.xp} XP</Text>
                    <Text style={styles.playerWins}>{player.wins}W</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚙️ Configurações</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.settingsList}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>🔔 Notificações</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={settings.setNotificationsEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#10B981" }}
                  thumbColor={notificationsEnabled ? "white" : "#9CA3AF"}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>👥 Perfil Público</Text>
                <Switch
                  value={profilePublic}
                  onValueChange={settings.setProfilePublic}
                  trackColor={{ false: "#E5E7EB", true: "#10B981" }}
                  thumbColor={profilePublic ? "white" : "#9CA3AF"}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.settingButton}
                onPress={() => {
                  Alert.alert(
                    "🎨 Alterar Tema", 
                    "Escolha o tema visual:",
                    [
                      { text: "🌞 Claro", onPress: () => settings.setTheme('light') },
                      { text: "🌙 Escuro", onPress: () => settings.setTheme('dark') },
                      { text: "🎨 Automático", onPress: () => settings.setTheme('system') },
                      { text: "Cancelar", style: "cancel" }
                    ]
                  );
                }}
              >
                <Text style={styles.settingButtonText}>🎨 Alterar Tema</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingButton}
                onPress={() => {
                  Alert.alert(
                    "☁️ Backup na Nuvem", 
                    "Seus dados serão salvos com segurança na nuvem.",
                    [
                      { 
                        text: "Fazer Backup", 
                        onPress: async () => {
                          Alert.alert("⏳ Processando", "Fazendo backup dos seus dados...");
                          await settings.backupToCloud();
                        }
                      },
                      { text: "Cancelar", style: "cancel" }
                    ]
                  );
                }}
              >
                <Text style={styles.settingButtonText}>☁️ Backup na Nuvem</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingButton}
                onPress={async () => {
                  try {
                    const json = await settings.getExportPayload();
                    Alert.alert('Dados exportados', json.substring(0, 200) + (json.length > 200 ? '...' : ''));
                  } catch (e) {
                    Alert.alert('Erro', 'Não foi possível exportar os dados.');
                  }
                }}
              >
                <Text style={styles.settingButtonText}>📥 Exportar Dados</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingButton}
                onPress={() => {
                  Alert.alert(
                    "ℹ️ Duelo Metabólico", 
                    "🎮 Versão 1.0.0\n\n📚 Desenvolvido especialmente para estudantes e profissionais de Nutrição\n\n🎯 Aprenda metabolismo de forma divertiva e estratégica\n\n👥 Compete com outros nutricionistas\n\n🏆 Desenvolva habilidades clínicas\n\n⚡ Sistema de poderes para estratégias avançadas\n\n💡 Criado por especialistas em educação nutricional\n\n🔄 Atualizações regulares com novos casos e funcionalidades",
                    [{ text: "Fechar" }]
                  );
                }}
              >
                <Text style={styles.settingButtonText}>ℹ️ Sobre o App</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#10B981",
  },
  nickname: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  battleStats: {
    padding: 20,
  },
  battleStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  battleStatItem: {
    width: "48%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  battleStatValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  battleStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  achievementsSection: {
    padding: 20,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  achievementItem: {
    width: "48%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  achievementLocked: {
    backgroundColor: "#F3F4F6",
  },
  achievementName: {
    fontSize: 12,
    color: "#1F2937",
    marginTop: 8,
    textAlign: "center",
  },
  achievementNameLocked: {
    color: "#9CA3AF",
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButton: {
    borderColor: "#FEE2E2",
    borderWidth: 1,
    backgroundColor: "#FEF2F2",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  logoutButtonText: {
    color: "#EF4444",
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
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  rankingList: {
    maxHeight: 400,
  },
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  currentUserRank: {
    backgroundColor: "#ECFDF5",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  rankInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  topRankBadge: {
    backgroundColor: "#F59E0B",
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B7280",
  },
  topRankNumber: {
    color: "white",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  playerLeague: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  playerStats: {
    alignItems: "flex-end",
  },
  playerXP: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  playerWins: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  settingsList: {
    maxHeight: 400,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  settingButton: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    alignItems: "center",
  },
  settingButtonText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  winStreakSection: {
    padding: 20,
  },
  winStreakCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  winStreakNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#EF4444",
  },
  winStreakLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 5,
  },
  winStreakRecord: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 5,
  },
});