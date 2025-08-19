import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "@/providers/GameProvider";
import { UserProvider } from "@/providers/UserProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Voltar" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="duel" 
        options={{ 
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="tutorial" 
        options={{ 
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="create-room" 
        options={{ 
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="case-details" 
        options={{ 
          title: "Detalhes do Caso",
          presentation: "modal"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <UserProvider>
            <SettingsProvider>
              <GameProvider>
                <RootLayoutNav />
              </GameProvider>
            </SettingsProvider>
          </UserProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}