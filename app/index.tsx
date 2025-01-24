import { primary } from "@/constants/Colors";
import { useRefreshOnFocus } from "@/hook/useRefetchOnFocus";
import { getMe } from "@/lib/http/quries";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { setIsLogedIn, setUserDetails } = useUserStore();

  const loginQuery = useQuery<{
    user: {
      email: string;
      id: number;
      name: string;
    }
  }>({
    queryKey: ['getme'],
    queryFn: getMe,
    refetchInterval: 1000,
  });
  const refetch = loginQuery.refetch;
  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (loginQuery.isSuccess) {
      setIsLogedIn(true);
      setUserDetails(loginQuery.data.user);
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
    } else if (loginQuery.isError) {
      setIsLogedIn(false);
      setTimeout(() => {
        router.replace("/(auth)/welcome");
      }, 2000);
    }
  }, [loginQuery.isSuccess, loginQuery.isError]);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image source={require('@/assets/images/nexus-logo.webp')} />
      <TouchableOpacity onPress={() => router.push("/(auth)/welcome")} style={{ marginTop: 30 }}>
        <Text>Go to welcome</Text>
      </TouchableOpacity>
      {
        loginQuery.isFetching && <ActivityIndicator size="large" color={primary} />
      }
    </View>
  );
}
