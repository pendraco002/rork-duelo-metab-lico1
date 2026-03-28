import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  nickname: string;
  email: string;
  level: number;
  xp: number;
  league: string;
  wins: number;
  losses: number;
  coins: number;
  winStreak: number;
  maxWinStreak: number;
  totalGamesPlayed: number;
  powerCardsOwned: string[];
  achievements: string[];
  lastDailyReward: Date | null;
  seasonTier: number;
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User>({
    id: "user-1",
    nickname: "NutriMaster",
    email: "nutrimaster@example.com",
    level: 12,
    xp: 650,
    league: "Ouro",
    wins: 28,
    losses: 12,
    coins: 150,
    winStreak: 3,
    maxWinStreak: 7,
    totalGamesPlayed: 40,
    powerCardsOwned: ["time-pressure", "shield", "focus"],
    achievements: ["first-win", "win-streak-5"],
    lastDailyReward: null,
    seasonTier: 8,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Ensure achievements is always an array
        if (!Array.isArray(userData.achievements)) {
          userData.achievements = [];
        }
        // Ensure powerCardsOwned is always an array
        if (!Array.isArray(userData.powerCardsOwned)) {
          userData.powerCardsOwned = [];
        }
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const saveUser = useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }, []);

  const updateStats = useCallback((won: boolean, score: number) => {
    const baseCoins = won ? 15 : 5;
    const bonusCoins = Math.floor(score / 10);
    const totalCoins = baseCoins + bonusCoins;
    
    const updatedUser = {
      ...user,
      wins: won ? user.wins + 1 : user.wins,
      losses: won ? user.losses : user.losses + 1,
      xp: user.xp + score,
      level: Math.floor((user.xp + score) / 100),
      coins: user.coins + totalCoins,
      winStreak: won ? user.winStreak + 1 : 0,
      maxWinStreak: won ? Math.max(user.maxWinStreak, user.winStreak + 1) : user.maxWinStreak,
      totalGamesPlayed: user.totalGamesPlayed + 1,
      seasonTier: Math.floor((user.xp + score) / 150),
    };
    
    // Update league based on level
    if (updatedUser.level >= 20) {
      updatedUser.league = "Diamante";
    } else if (updatedUser.level >= 15) {
      updatedUser.league = "Platina";
    } else if (updatedUser.level >= 10) {
      updatedUser.league = "Ouro";
    } else if (updatedUser.level >= 5) {
      updatedUser.league = "Prata";
    } else {
      updatedUser.league = "Bronze";
    }
    
    setUser(updatedUser);
    saveUser(updatedUser);
  }, [user, saveUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginUser = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate with backend
    if (email && password) {
      let userData;
      
      // Demo account with pre-filled stats
      if (email === "demo@demo.com" && password === "123456") {
        userData = {
          id: "demo-user",
          nickname: "NutriDemo",
          email,
          level: 8,
          xp: 750,
          league: "Ouro",
          wins: 15,
          losses: 7,
          coins: 200,
          winStreak: 2,
          maxWinStreak: 8,
          totalGamesPlayed: 22,
          powerCardsOwned: ["time-pressure", "shield", "focus", "expertise"],
          achievements: ["first-win", "win-streak-5"],
          lastDailyReward: null,
          seasonTier: 5,
        };
      } else {
        userData = {
          id: `user-${Date.now()}`,
          nickname: email.split('@')[0],
          email,
          level: 1,
          xp: 0,
          league: "Bronze",
          wins: 0,
          losses: 0,
          coins: 50,
          winStreak: 0,
          maxWinStreak: 0,
          totalGamesPlayed: 0,
          powerCardsOwned: [],
          achievements: [],
          lastDailyReward: null,
          seasonTier: 0,
        };
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      await saveUser(userData);
    } else {
      throw new Error("Invalid credentials");
    }
  }, [saveUser]);

  const registerUser = useCallback(async (email: string, password: string, nickname: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: `user-${Date.now()}`,
      nickname,
      email,
      level: 1,
      xp: 0,
      league: "Bronze",
      wins: 0,
      losses: 0,
      coins: 50,
      winStreak: 0,
      maxWinStreak: 0,
      totalGamesPlayed: 0,
      powerCardsOwned: [],
      achievements: [],
      lastDailyReward: null,
      seasonTier: 0,
    };
    setUser(userData);
    setIsAuthenticated(true);
    await saveUser(userData);
  }, [saveUser]);

  const logoutUser = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const purchaseItem = useCallback((itemId: string, price: number) => {
    if (user.coins >= price) {
      const updatedUser = {
        ...user,
        coins: user.coins - price,
      };
      setUser(updatedUser);
      saveUser(updatedUser);
      return true;
    }
    return false;
  }, [user, saveUser]);

  const claimDailyReward = useCallback(() => {
    const now = new Date();
    const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
    
    if (!lastReward || now.getDate() !== lastReward.getDate()) {
      const dailyCoins = 25;
      const dailyXP = 50;
      
      const updatedUser = {
        ...user,
        coins: user.coins + dailyCoins,
        xp: user.xp + dailyXP,
        lastDailyReward: now,
      };
      
      setUser(updatedUser);
      saveUser(updatedUser);
      return { coins: dailyCoins, xp: dailyXP };
    }
    return null;
  }, [user, saveUser]);

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievements = Array.isArray(user.achievements) ? user.achievements : [];
    if (!achievements.includes(achievementId)) {
      const updatedUser = {
        ...user,
        achievements: [...achievements, achievementId],
      };
      setUser(updatedUser);
      saveUser(updatedUser);
      return true;
    }
    return false;
  }, [user, saveUser]);

  return {
    user,
    isAuthenticated,
    updateStats,
    loginUser,
    registerUser,
    logoutUser,
    purchaseItem,
    claimDailyReward,
    unlockAchievement,
  };
});