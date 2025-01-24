import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StatusBar } from "react-native";


export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} >;
        <Stack.Screen name="(modals)/add_salesmen" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/add_store" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/notification" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/assign/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/qr/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/salesmen/[id]" options={{ presentation: "modal" }} />
      </Stack >
    </QueryClientProvider>

  )
}
