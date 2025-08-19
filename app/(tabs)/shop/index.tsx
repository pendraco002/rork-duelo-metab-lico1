import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  Gift, 
  Zap, 
  Crown, 
  Sparkles,
  X,
  Check
} from "lucide-react-native";
import { useUser } from "@/providers/UserProvider";
import { SHOP_ITEMS } from "@/constants/mockData";

export default function ShopScreen() {
  const { user, purchaseItem, claimDailyReward } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const categories = [
    { id: "all", name: "Todos", icon: "🛍️" },
    { id: "power", name: "Poderes", icon: "⚡" },
    { id: "boost", name: "Boosts", icon: "🚀" },
    { id: "cosmetic", name: "Cosméticos", icon: "✨" },
  ];

  const filteredItems = SHOP_ITEMS.filter(item => 
    selectedCategory === "all" || item.type === selectedCategory
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "#9CA3AF";
      case "rare": return "#3B82F6";
      case "epic": return "#8B5CF6";
      case "legendary": return "#F59E0B";
      default: return "#9CA3AF";
    }
  };

  const getRarityGradient = (rarity: string): [string, string] => {
    switch (rarity) {
      case "common": return ["#F3F4F6", "#E5E7EB"];
      case "rare": return ["#DBEAFE", "#BFDBFE"];
      case "epic": return ["#EDE9FE", "#DDD6FE"];
      case "legendary": return ["#FEF3C7", "#FDE68A"];
      default: return ["#F3F4F6", "#E5E7EB"];
    }
  };

  const handlePurchase = (item: any) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedItem && purchaseItem(selectedItem.id, selectedItem.price)) {
      Alert.alert(
        "🎉 Compra Realizada!",
        `Você comprou ${selectedItem.name} por ${selectedItem.price} moedas!`,
        [{ text: "OK" }]
      );
      
      // Animate purchase success
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Alert.alert(
        "💰 Moedas Insuficientes",
        "Você não tem moedas suficientes para esta compra. Jogue mais duelos para ganhar moedas!",
        [{ text: "OK" }]
      );
    }
    setShowPurchaseModal(false);
    setSelectedItem(null);
  };

  const handleDailyReward = () => {
    const reward = claimDailyReward();
    if (reward) {
      setShowDailyReward(true);
      setTimeout(() => setShowDailyReward(false), 3000);
    } else {
      Alert.alert(
        "⏰ Recompensa Diária",
        "Você já coletou sua recompensa diária hoje! Volte amanhã para mais.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <LinearGradient
        colors={["#8B5CF6", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <ShoppingBag color="white" size={28} />
            <View>
              <Text style={styles.headerTitle}>Loja Nutricional</Text>
              <Text style={styles.headerSubtitle}>Melhore seu desempenho</Text>
            </View>
          </View>
          
          <View style={styles.coinsContainer}>
            <Coins color="#F59E0B" size={20} />
            <Text style={styles.coinsText}>{user.coins}</Text>
          </View>
        </View>

        {/* Daily Reward Button */}
        <TouchableOpacity style={styles.dailyRewardButton} onPress={handleDailyReward}>
          <Gift color="white" size={20} />
          <Text style={styles.dailyRewardText}>Recompensa Diária</Text>
          <Sparkles color="#F59E0B" size={16} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shop Items */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <Animated.View 
              key={item.id} 
              style={[styles.itemCard, { transform: [{ scale: scaleAnim }] }]}
            >
              <LinearGradient
                colors={getRarityGradient(item.rarity)}
                style={styles.itemGradient}
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
                    <Star color="white" size={12} />
                  </View>
                </View>
                
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                
                <View style={styles.itemFooter}>
                  <View style={styles.priceContainer}>
                    <Coins color="#F59E0B" size={16} />
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      user.coins < item.price && styles.buyButtonDisabled
                    ]}
                    onPress={() => handlePurchase(item)}
                    disabled={user.coins < item.price}
                  >
                    <Text style={[
                      styles.buyButtonText,
                      user.coins < item.price && styles.buyButtonTextDisabled
                    ]}>
                      Comprar
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Special Offers */}
        <View style={styles.specialOffersSection}>
          <Text style={styles.sectionTitle}>🔥 Ofertas Especiais</Text>
          
          <LinearGradient
            colors={["#F59E0B", "#EF4444"]}
            style={styles.specialOfferCard}
          >
            <View style={styles.specialOfferContent}>
              <Crown color="white" size={32} />
              <View style={styles.specialOfferText}>
                <Text style={styles.specialOfferTitle}>Pacote VIP</Text>
                <Text style={styles.specialOfferDescription}>
                  1000 moedas + 5 poderes épicos + boost XP 24h
                </Text>
              </View>
              <TouchableOpacity style={styles.specialOfferButton}>
                <Text style={styles.specialOfferButtonText}>R$ 9,99</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.specialOfferCard}
          >
            <View style={styles.specialOfferContent}>
              <Zap color="white" size={32} />
              <View style={styles.specialOfferText}>
                <Text style={styles.specialOfferTitle}>Starter Pack</Text>
                <Text style={styles.specialOfferDescription}>
                  500 moedas + 3 poderes raros + boost moedas 12h
                </Text>
              </View>
              <TouchableOpacity style={styles.specialOfferButton}>
                <Text style={styles.specialOfferButtonText}>R$ 4,99</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Purchase Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPurchaseModal}
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPurchaseModal(false)}
            >
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            
            {selectedItem && (
              <>
                <Text style={styles.modalIcon}>{selectedItem.icon}</Text>
                <Text style={styles.modalTitle}>Confirmar Compra</Text>
                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                
                <View style={styles.modalPriceContainer}>
                  <Coins color="#F59E0B" size={20} />
                  <Text style={styles.modalPrice}>{selectedItem.price} moedas</Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowPurchaseModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={confirmPurchase}
                  >
                    <Text style={styles.modalConfirmText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Daily Reward Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDailyReward}
        onRequestClose={() => setShowDailyReward(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rewardModalContent}>
            <Sparkles color="#F59E0B" size={48} />
            <Text style={styles.rewardModalTitle}>🎉 Recompensa Coletada!</Text>
            <Text style={styles.rewardModalText}>+25 moedas</Text>
            <Text style={styles.rewardModalText}>+50 XP</Text>
            <Check color="#10B981" size={32} />
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
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  coinsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dailyRewardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: "center",
    gap: 8,
  },
  dailyRewardText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginRight: 12,
    gap: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryChipActive: {
    backgroundColor: "#8B5CF6",
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryTextActive: {
    color: "white",
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  itemCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  itemGradient: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemIcon: {
    fontSize: 32,
  },
  rarityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
  },
  buyButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buyButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  buyButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  buyButtonTextDisabled: {
    color: "#9CA3AF",
  },
  specialOffersSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  specialOfferCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  specialOfferContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  specialOfferText: {
    flex: 1,
  },
  specialOfferTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  specialOfferDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  specialOfferButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  specialOfferButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalCloseButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  modalItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  modalPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 25,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  modalCancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  modalConfirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#10B981",
  },
  modalConfirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  rewardModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  rewardModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginVertical: 15,
  },
  rewardModalText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
    marginVertical: 2,
  },
});