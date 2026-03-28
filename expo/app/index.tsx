import React from "react";
import { Redirect } from "expo-router";
import { useUser } from "@/providers/UserProvider";

export default function RootIndex() {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/arena" />;
}