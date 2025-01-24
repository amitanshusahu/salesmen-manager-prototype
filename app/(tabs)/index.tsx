import { primary } from '@/constants/Colors';
import { useUserStore } from '@/store';
import { useRouter } from 'expo-router';
import { Bell } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function TabTwoScreen() {
  const router = useRouter();
  const { userDetails } = useUserStore();
  return (
   <View style={{padding: 30, backgroundColor: "white", minHeight: "100%"}}>
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 16 }}>{userDetails?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(modals)/notification")}>
            <Bell size={32} color={`${primary}`} />
          </TouchableOpacity>
        </View>

      <View style={{marginTop: 30}}>

      </View>

   </View>
  );
}

const styles = StyleSheet.create({

});