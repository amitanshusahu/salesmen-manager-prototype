import AreaGraph from '@/components/ui/AreaGraph';
import TotalMannaged from '@/components/ui/TotalMannaged';
import { primary } from '@/constants/Colors';
import { getMe } from '@/lib/http/quries';
import { useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function TabTwoScreen() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useUserStore();
  const loginQuery = useQuery<{
    user: {
      email: string;
      id: number;
      name: string;
    }
  }>({
    queryKey: ['getme'],
    queryFn: getMe,
  });
  useEffect(() => {
    if (loginQuery.isSuccess) {
      setUserDetails(loginQuery.data.user);
    }
  }, [loginQuery.data]);

  return (
    <ScrollView>
      <View style={{ padding: 30, backgroundColor: "white", minHeight: "100%" }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
            <Text style={{ fontSize: 16 }}>{userDetails?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(modals)/notification")}>
            <Bell size={32} color={`${primary}`} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 60 }}>
          <TotalMannaged />
          <AreaGraph />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});