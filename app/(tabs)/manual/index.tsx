import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { HelpCircle, BookOpen, Zap, Trophy } from "lucide-react-native";

export default function ManualTabScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#10B981", "#0EA5E9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <HelpCircle color="white" size={28} />
          <Text style={styles.headerTitle}>Manual do Jogo</Text>
        </View>
        <Text style={styles.headerSubtitle}>Aprenda as regras e dicas essenciais do Duelo Metabólico</Text>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <BookOpen color="#10B981" size={20} />
          <Text style={styles.cardTitle}>Como Jogar</Text>
        </View>
        <Text style={styles.cardText}>1. Escolha o modo de jogo 1v1 ou Equipe{"\n"}2. Leia o caso clínico com atenção{"\n"}3. Selecione até 3 intervenções por fase{"\n"}4. Enfrente o evento adverso e adapte-se{"\n"}5. Compare resultados e ganhe XP</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Zap color="#EF4444" size={20} />
          <Text style={styles.smallCardTitle}>Poderes</Text>
          <Text style={styles.smallCardText}>Use cartas especiais para alterar o rumo da partida.</Text>
        </View>
        <View style={styles.smallCard}>
          <Trophy color="#F59E0B" size={20} />
          <Text style={styles.smallCardTitle}>Pontuação</Text>
          <Text style={styles.smallCardText}>Maior NutriScore vence. Estratégia {'>'} velocidade.</Text>
        </View>
      </View>

      <TouchableOpacity testID="open-full-manual" style={styles.ctaButton} onPress={() => router.push("/tutorial") }>
        <Text style={styles.ctaText}>Abrir Manual Completo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { paddingBottom: 40 },
  header: { padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "rgba(255,255,255,0.9)", marginTop: 6 },
  card: { backgroundColor: "white", margin: 20, padding: 16, borderRadius: 12, gap: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  cardText: { fontSize: 14, color: "#6B7280", lineHeight: 20 },
  row: { flexDirection: "row", gap: 10, paddingHorizontal: 20 },
  smallCard: { flex: 1, backgroundColor: "white", padding: 16, borderRadius: 12, gap: 6 },
  smallCardTitle: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  smallCardText: { fontSize: 12, color: "#6B7280" },
  ctaButton: { margin: 20, backgroundColor: "#10B981", padding: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "white", fontSize: 16, fontWeight: "600" },
});