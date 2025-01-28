import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Score from '@/components/ui/Score';
import { primary } from '@/constants/Colors';
import { MapPinPlus } from 'phosphor-react-native';
import AssignedStores from '@/components/ui/AssignedStores';

export default function AboutSalesmen() {
  const { id, name, uid } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={styles.screen}>
      {
        typeof (id) === 'string' && <Score id={id} name={String(name)} uid={String(uid)} />
      }

      <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Todays Activity</Text>
        <TouchableOpacity style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => router.push(`/(modals)/assign/${id}`)}>
          <Text style={{ color: primary, fontWeight: 'bold', fontSize: 16  }}>Assign Store</Text>
          <MapPinPlus size={15} weight='fill' color={primary} />
        </TouchableOpacity>
      </View>

      <AssignedStores id={Number(id)} />
      
      <View style={{padding: 30}}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    backgroundColor: 'white',
    minHeight: '100%',
  }
});
