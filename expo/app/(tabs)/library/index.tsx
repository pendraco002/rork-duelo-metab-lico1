import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Search, Filter, Clock, CheckCircle, XCircle, BookOpen, TrendingUp, Award } from "lucide-react-native";
import { useRouter } from "expo-router";
import { MOCK_CASES } from "@/constants/mockData";

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "won" | "lost">("all");

  const filteredCases = MOCK_CASES.filter((caseItem) => {
    const matchesSearch = caseItem.patientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      caseItem.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === "all" ||
      (selectedFilter === "won" && caseItem.result === "won") ||
      (selectedFilter === "lost" && caseItem.result === "lost");
    
    return matchesSearch && matchesFilter;
  });

  const getResultColor = (result: string) => {
    return result === "won" ? "#10B981" : "#EF4444";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <BookOpen color="#10B981" size={28} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Biblioteca de Casos</Text>
            <Text style={styles.headerSubtitle}>Revise e aprenda com casos anteriores</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <TrendingUp color="#10B981" size={16} />
            <Text style={styles.statText}>{MOCK_CASES.filter(c => c.result === "won").length} vitórias</Text>
          </View>
          <View style={styles.statItem}>
            <Award color="#F59E0B" size={16} />
            <Text style={styles.statText}>Média: {Math.round(MOCK_CASES.reduce((acc, c) => acc + c.nutriScore, 0) / MOCK_CASES.length) || 0}</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por paciente ou diagnóstico..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === "all" && styles.filterChipActive]}
          onPress={() => setSelectedFilter("all")}
        >
          <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === "won" && styles.filterChipActive]}
          onPress={() => setSelectedFilter("won")}
        >
          <CheckCircle color={selectedFilter === "won" ? "white" : "#10B981"} size={16} />
          <Text style={[styles.filterText, selectedFilter === "won" && styles.filterTextActive]}>
            Vitórias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === "lost" && styles.filterChipActive]}
          onPress={() => setSelectedFilter("lost")}
        >
          <XCircle color={selectedFilter === "lost" ? "white" : "#EF4444"} size={16} />
          <Text style={[styles.filterText, selectedFilter === "lost" && styles.filterTextActive]}>
            Derrotas
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Cases List */}
      <ScrollView style={styles.casesList} showsVerticalScrollIndicator={false}>
        {filteredCases.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>Nenhum caso encontrado</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? "Tente uma busca diferente" : "Jogue alguns duelos para ver casos aqui"}
            </Text>
          </View>
        ) : (
          filteredCases.map((caseItem) => (
            <TouchableOpacity
              key={caseItem.id}
              style={styles.caseCard}
              onPress={() => router.push(`/case-details?id=${caseItem.id}`)}
            >
            <View style={styles.caseHeader}>
              <View style={styles.caseInfo}>
                <Text style={styles.patientName}>{caseItem.patientName}</Text>
                <Text style={styles.diagnosis}>{caseItem.diagnosis}</Text>
              </View>
              <View
                style={[
                  styles.resultBadge,
                  { backgroundColor: getResultColor(caseItem.result) },
                ]}
              >
                <Text style={styles.resultText}>
                  {caseItem.result === "won" ? "Vitória" : "Derrota"}
                </Text>
              </View>
            </View>
            
            <View style={styles.caseDetails}>
              <View style={styles.detailItem}>
                <Clock color="#9CA3AF" size={14} />
                <Text style={styles.detailText}>{caseItem.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.scoreLabel}>NutriScore:</Text>
                <Text style={styles.scoreValue}>{caseItem.nutriScore}</Text>
              </View>
            </View>

            <View style={styles.interventions}>
              <Text style={styles.interventionsTitle}>Intervenções aplicadas:</Text>
              <View style={styles.interventionsList}>
                {caseItem.interventions.slice(0, 3).map((intervention, index) => (
                  <View key={index} style={styles.interventionChip}>
                    <Text style={styles.interventionText}>{intervention}</Text>
                  </View>
                ))}
              </View>
            </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#10B981",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "white",
  },
  casesList: {
    flex: 1,
    padding: 20,
  },
  caseCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  caseInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  diagnosis: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  caseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
  },
  interventions: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
  },
  interventionsTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  interventionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interventionChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  interventionText: {
    fontSize: 11,
    color: "#3B82F6",
  },
});