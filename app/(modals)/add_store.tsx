import Button from "@/components/ui/Button";
import { addLocation } from "@/lib/http/mutations";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import { CaretLeft, MapPinPlus } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { primary } from "@/constants/Colors";

export default function AddStore() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const router = useRouter();

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
  
    if (status !== 'granted') {
      alert('Permission Denied');
      return null;
    }
  
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return loc.coords;
    } catch (error) {
      alert('Error retrieving location');
      console.error(error);
      return null;
    }
  };
  

  const handleInputNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setName(e.nativeEvent.text);
  };

  const handleAddressChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setAddress(e.nativeEvent.text);
  };

  const mutation = useMutation({
    mutationFn: addLocation,
    onSuccess: (data) => {
      console.log(data);
      alert('Store Added Successfully');
      setName('');
      setAddress('');
      setLatitude(null);
      setLongitude(null);
    },
    onError: (error) => {
      console.error(error);
      alert('Error Adding Store');
    },
  });

  const handleAddStore = async () => {
    const location = await getLocation();
  
    if (location) {
      const { latitude, longitude } = location;
      mutation.mutate({ name, address, latitude, longitude });
    } else {
      alert('Please retrieve the location first.');
    }
  };

  return (
    <View style={{ padding: 30, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <CaretLeft size={32} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={{ display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, marginTop: 100 }}>
        <MapPinPlus size={100} color={primary} />
        <TextInput
          placeholder="Name"
          value={name}
          onChange={handleInputNameChange}
          style={style.input}
        />
        <TextInput
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
          style={style.input}
        />
        <Button
          title="Add Store"
          btnStyle={{ width: '100%', backgroundColor: primary }}
          textStyle={{ color: 'white' }}
          onPress={handleAddStore}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    fontSize: 18,
  },
});
