import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Circle } from 'react-native-svg';
import { CaretLeft, ClockCounterClockwise, GpsFix, MapPin } from 'phosphor-react-native';
import { primary } from '@/constants/Colors';

export default function Score({id, name, uid}: {id: string, name?: string, uid?: string}) {
  const router = useRouter();
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10, backgroundColor: "#f2f2f2", borderRadius: 10 }}>
          <CaretLeft size={32} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.svgContainer}>
          <Svg height="150" width="150" style={styles.svg}>
            <Circle
              cx="75"
              cy="75"
              r="70"
              stroke="#4CAF50"
              strokeWidth="5"
              fill="#E8F5E9"
            />
          </Svg>
          <Text style={styles.scoreText}>7</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.salesmanName}>{name}</Text>
          <Text style={styles.salesmanId}>ID: {id}, {uid}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    backgroundColor: 'white',
    minHeight: '100%',
  },
  salesmanName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  salesmanId: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  svgContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  scoreText: {
    fontSize: 80,
    fontWeight: '800',
    color: '#4CAF50',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f2fafb',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginLeft: 10,
  },
});