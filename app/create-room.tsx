import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  X, 
  Copy, 
  Share2, 
  Users, 
  Clock,
  CheckCircle,
  UserPlus
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/providers/GameProvider";
import { useUser } from "@/providers/UserProvider";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function CreateRoomScreen() {
  const router = useRouter();
  const { createRoom, joinRoom, currentRoom } = useGame();
  const { user } = useUser();
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [waitingForPlayers, setWaitingForPlayers] = useState(false);

  useEffect(() => {
    if (currentRoom) {
      setRoomCode(currentRoom.code);
      setRoomCreated(true);
      setWaitingForPlayers(true);
    }
  }, [currentRoom]);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsCreating(true);
    const newRoomCode = generateRoomCode();
    
    setTimeout(() => {
      createRoom(newRoomCode, "1v1");
      setRoomCode(newRoomCode);
      setRoomCreated(true);
      setWaitingForPlayers(true);
      setIsCreating(false);
    }, 1500);
  };

  const handleCopyCode = async () => {
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (Platform.OS === "web") {
      navigator.clipboard.writeText(roomCode);
    } else {
      Clipboard.setString(roomCode);
    }
    
    Alert.alert("Copiado!", "Código da sala copiado para a área de transferência");
  };

  const handleShareCode = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await Share.share({
        message: `Venha jogar Duelo Metabólico comigo! Use o código: ${roomCode}`,
        title: "Convite para Duelo Metabólico",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleStartGame = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    router.push("/duel");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#8B5CF6", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.content}>
          {!roomCreated ? (
            <>
              <View style={styles.iconContainer}>
                <Users color="white" size={80} />
              </View>
              
              <Text style={styles.title}>Criar Sala Privada</Text>
              <Text style={styles.description}>
                Crie uma sala para jogar com seus amigos ou colegas de classe
              </Text>

              <TouchableOpacity
                style={[styles.createButton, isCreating && styles.createButtonDisabled]}
                onPress={handleCreateRoom}
                disabled={isCreating}
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? "Criando Sala..." : "Criar Sala"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.iconContainer}>
                <CheckCircle color="white" size={80} />
              </View>
              
              <Text style={styles.title}>Sala Criada!</Text>
              <Text style={styles.description}>
                Compartilhe o código abaixo com outros jogadores
              </Text>

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Código da Sala:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{roomCode}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCopyCode}>
                  <Copy color="#8B5CF6" size={20} />
                  <Text style={styles.actionButtonText}>Copiar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleShareCode}>
                  <Share2 color="#8B5CF6" size={20} />
                  <Text style={styles.actionButtonText}>Compartilhar</Text>
                </TouchableOpacity>
              </View>

              {waitingForPlayers && (
                <View style={styles.waitingContainer}>
                  <UserPlus color="rgba(255, 255, 255, 0.8)" size={24} />
                  <Text style={styles.waitingText}>Aguardando jogadores...</Text>
                  <Text style={styles.playersCount}>1/2 jogadores</Text>
                </View>
              )}

              <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                <Text style={styles.startButtonText}>Iniciar Jogo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {roomCreated && (
          <View style={styles.roomInfo}>
            <View style={styles.roomInfoItem}>
              <Clock color="rgba(255, 255, 255, 0.8)" size={16} />
              <Text style={styles.roomInfoText}>Sala expira em 10 min</Text>
            </View>
            <View style={styles.roomInfoItem}>
              <Users color="rgba(255, 255, 255, 0.8)" size={16} />
              <Text style={styles.roomInfoText}>Modo: 1 vs 1</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  createButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  codeLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 10,
  },
  codeBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  codeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  actionButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
  waitingContainer: {
    alignItems: "center",
    marginBottom: 30,
    gap: 8,
  },
  waitingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  playersCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  startButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  roomInfo: {
    position: "absolute",
    bottom: 40,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roomInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roomInfoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
});