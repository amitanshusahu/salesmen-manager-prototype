import { getMe } from "@/lib/http/quries";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { setIsLogedIn, isLogedIn } = useUserStore();

  const loginQuery = useQuery({
    queryKey: ['tryme'],
    queryFn: getMe,
    enabled: !isLogedIn,
    retry: false,
  });

  useEffect(() => {
    if (loginQuery.isSuccess) {
      setIsLogedIn(true);
    }
  }, [setIsLogedIn, loginQuery.data]);

  useEffect(() => {
    if (isLogedIn) {
      console.log("isLogedIn", isLogedIn);
      // router.push("/(tabs)");
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text style={{ fontSize: 40 }}>Splash screen</Text>
      <TouchableOpacity onPress={() => router.push("/(auth)/welcome")}>
        <Text>Go to welcome</Text>
      </TouchableOpacity>
    </View>
  );
}
