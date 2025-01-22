import Button from '@/components/ui/Button'
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native'

export default function welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headingHolder}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Salesman</Text>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Track</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>we track sales this is just a prototype application</Text>
      </View>
      <View style={{
        width: "100%",
        gap: 20,
      }}>
        <Button
          title="Login"
          btnStyle={styles.loginButton}
          textStyle={styles.loginbuttonText}
          onPress={() => router.push("/(auth)/login")}
        />
        <View style={{ height: 20 }}>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
        <Button
          title="Signup"
          btnStyle={styles.signupButton}
          textStyle={styles.signupButtonText}
          onPress={() => router.push("/(auth)/signup")}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2b7cff",
    justifyContent: "flex-end",
    alignItems: "baseline",
    padding: 30,
  },
  headingHolder: {
    marginBottom: 50,
  },
  buttonHolder: {
    width: "100%",
    gap: 20,
  },
  loginButton: {
    width: "100%"
  },
  loginbuttonText: {
    color: "#aaa"
  },
  signupButton: {
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
    width: "100%",
  },
  signupButtonText: {
    color: "white"
  }
})