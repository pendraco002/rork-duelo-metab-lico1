import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";

interface Game {
  id: string;
  mode: "1v1" | "team";
  roomCode: string;
  opponent: string;
  startTime: Date;
  opponentScore: number;
}

interface OnlinePlayer {
  id: string;
  name: string;
  league: string;
  status: "Disponível" | "Em duelo" | "Ausente";
  lastSeen: Date;
}

interface Room {
  code: string;
  mode: "1v1" | "team";
  players: string[];
  maxPlayers: number;
  createdAt: Date;
  isActive: boolean;
}

export const [GameProvider, useGame] = createContextHook(() => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isOpponentTurn, setIsOpponentTurn] = useState(false);
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);

  // Simulate more realistic opponent actions
  useEffect(() => {
    if (currentGame && !isOpponentTurn) {
      const simulateOpponent = () => {
        setIsOpponentTurn(true);
        console.log(`${currentGame.opponent} está fazendo sua jogada...`);
        
        // Simulate opponent thinking time and making strategic moves
        setTimeout(() => {
          // More realistic scoring based on opponent skill
          const baseScore = Math.floor(Math.random() * 15) + 10; // 10-25 points
          const skillBonus = Math.random() > 0.7 ? 5 : 0; // 30% chance of bonus
          const finalScore = baseScore + skillBonus;
          
          setOpponentScore(prev => prev + finalScore);
          setIsOpponentTurn(false);
          console.log(`${currentGame.opponent} ganhou ${finalScore} pontos`);
        }, 3000 + Math.random() * 4000); // 3-7 seconds (more realistic thinking time)
      };

      const timer = setTimeout(simulateOpponent, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentGame, isOpponentTurn]);

  const startDuel = useCallback((mode: "1v1" | "team", roomCode: string) => {
    const opponents = {
      "1v1": [
        { name: "Dr. Nutrição", league: "Diamante", skill: 0.9 },
        { name: "MetaboMaster", league: "Platina", skill: 0.8 },
        { name: "VitaminaC", league: "Ouro", skill: 0.7 },
        { name: "ProteínaPro", league: "Prata", skill: 0.6 },
        { name: "CarbControl", league: "Ouro", skill: 0.75 },
        { name: "FibraForte", league: "Bronze", skill: 0.5 },
      ],
      "team": [
        { name: "Equipe Alpha", league: "Diamante", skill: 0.85 },
        { name: "Nutri Squad", league: "Platina", skill: 0.75 },
        { name: "Meta Warriors", league: "Ouro", skill: 0.65 },
      ]
    };
    
    const randomOpponent = opponents[mode][Math.floor(Math.random() * opponents[mode].length)];
    
    const game: Game = {
      id: `game-${Date.now()}`,
      mode,
      roomCode,
      opponent: randomOpponent.name,
      startTime: new Date(),
      opponentScore: 0,
    };
    setCurrentGame(game);
    setOpponentScore(0);
    setIsOpponentTurn(false);
    
    console.log(`Duelo iniciado contra ${randomOpponent.name} (${randomOpponent.league})`);
  }, []);

  const endDuel = useCallback(() => {
    setCurrentGame(null);
    setOpponentScore(0);
    setIsOpponentTurn(false);
  }, []);

  const updateOpponentScore = useCallback((points: number) => {
    setOpponentScore(prev => prev + points);
  }, []);

  const createRoom = useCallback((roomCode: string, mode: "1v1" | "team") => {
    const room: Room = {
      code: roomCode,
      mode,
      players: ["You"],
      maxPlayers: mode === "1v1" ? 2 : 4,
      createdAt: new Date(),
      isActive: true,
    };
    setCurrentRoom(room);
  }, []);

  const joinRoom = useCallback((roomCode: string) => {
    // Simulate joining room
    const room: Room = {
      code: roomCode,
      mode: "1v1",
      players: ["Host", "You"],
      maxPlayers: 2,
      createdAt: new Date(),
      isActive: true,
    };
    setCurrentRoom(room);
  }, []);

  const leaveRoom = useCallback(() => {
    setCurrentRoom(null);
  }, []);

  const searchMatch = useCallback(async (mode: "1v1" | "team") => {
    setIsSearchingMatch(true);
    
    // Simulate more realistic matchmaking with multiple steps
    return new Promise<void>((resolve) => {
      // Step 1: Searching for players (1-2 seconds)
      setTimeout(() => {
        console.log("Procurando jogadores...");
        
        // Step 2: Found potential match (2-3 seconds)
        setTimeout(() => {
          console.log("Jogador encontrado! Conectando...");
          
          // Step 3: Establishing connection (1 second)
          setTimeout(() => {
            startDuel(mode, "MATCH" + Math.random().toString(36).substr(2, 4).toUpperCase());
            setIsSearchingMatch(false);
            resolve();
          }, 1000);
        }, 2000);
      }, 1500);
    });
  }, [startDuel]);

  return {
    currentGame,
    currentRoom,
    opponentScore,
    isOpponentTurn,
    isSearchingMatch,
    startDuel,
    endDuel,
    updateOpponentScore,
    createRoom,
    joinRoom,
    leaveRoom,
    searchMatch,
  };
});