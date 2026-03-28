import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import { MOCK_CASES } from "@/constants/mockData";

export default function CaseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const caseItem = MOCK_CASES.find((c) => c.id === id);

  if (!caseItem) {
    return (
      <View style={styles.container}>
        <Text>Caso não encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: caseItem.patientName }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.patientName}>{caseItem.patientName}</Text>
          <Text style={styles.diagnosis}>{caseItem.diagnosis}</Text>
          <View
            style={[
              styles.resultBadge,
              { backgroundColor: caseItem.result === "won" ? "#10B981" : "#EF4444" },
            ]}
          >
            <Text style={styles.resultText}>
              {caseItem.result === "won" ? "Vitória" : "Derrota"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Paciente</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Idade</Text>
              <Text style={styles.infoValue}>45 anos</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>IMC</Text>
              <Text style={styles.infoValue}>32.5</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Atividade</Text>
              <Text style={styles.infoValue}>Sedentário</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exames Laboratoriais</Text>
          <View style={styles.examsList}>
            <View style={styles.examItem}>
              <Text style={styles.examName}>Glicemia de Jejum</Text>
              <Text style={styles.examValue}>180 mg/dL</Text>
            </View>
            <View style={styles.examItem}>
              <Text style={styles.examName}>HbA1c</Text>
              <Text style={styles.examValue}>8.5%</Text>
            </View>
            <View style={styles.examItem}>
              <Text style={styles.examName}>Colesterol Total</Text>
              <Text style={styles.examValue}>240 mg/dL</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intervenções Aplicadas</Text>
          <View style={styles.interventionsList}>
            {caseItem.interventions.map((intervention, index) => (
              <View key={index} style={styles.interventionItem}>
                <Text style={styles.interventionText}>{intervention}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pontuação Final</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.nutriScore}>NutriScore: {caseItem.nutriScore}</Text>
            <Text style={styles.scoreDescription}>
              Baseado em eficácia metabólica, adesão do paciente e qualidade de vida
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
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
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  patientName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  diagnosis: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 5,
  },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 15,
  },
  resultText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 4,
  },
  examsList: {
    gap: 12,
  },
  examItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  examName: {
    fontSize: 14,
    color: "#6B7280",
  },
  examValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  interventionsList: {
    gap: 10,
  },
  interventionItem: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
  },
  interventionText: {
    fontSize: 14,
    color: "#3B82F6",
  },
  scoreContainer: {
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  nutriScore: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10B981",
  },
  scoreDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});