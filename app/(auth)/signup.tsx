import { postSignup } from "@/lib/http/mutations";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from "@/constants/AppConfig";
import { primary } from "@/constants/Colors";
import { useUserStore } from "@/store";
import { useRouter } from "expo-router";

export default function signup() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();
  const { setIsLogedIn } = useUserStore();
  const [password, setPassword] = useState<string>();
  const [name, setName] = useState<string>();
  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: async (data: { token: string }) => {
      console.log(data);
      await AsyncStorage.setItem(AppConfig.TOKEN_NAME, JSON.stringify(data.token));
      setIsLogedIn(true);
    },
    onError: (error) => {
      console.log(error.stack);
    }
  })

  const handleLoginPress = () => {
    console.log(email, password, name);
    if (email && password && name) {
      signupMutation.mutate({ name, email, password });
    }
  }

  const handleInputEmailChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setEmail(e.nativeEvent.text);
  }

  const handleInputPasswordChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setPassword(e.nativeEvent.text);
  }

  const handleInputNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setName(e.nativeEvent.text);
  }

  return (
    <View style={style.container}>
      <View style={style.headingHolder}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Create</Text>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Account</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>we track sales this is just a prototype application</Text>
      </View>
      <View style={{ backgroundColor: 'white', padding: 30, width: "100%", gap: 20, height: "50%" }}>
        <TextInput placeholder="Full Name" onChange={handleInputNameChange} style={style.input} />
        <TextInput placeholder="example@example.com" onChange={handleInputEmailChange} style={style.input} />
        <TextInput placeholder="Password" onChange={handleInputPasswordChange} style={style.input} />
        <Button title="Signup" onPress={handleLoginPress} btnStyle={{ backgroundColor: primary }} textStyle={{ color: "white" }} />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2b7cff",
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  headingHolder: {
    marginBottom: 50,
    padding: 30,
  },
})