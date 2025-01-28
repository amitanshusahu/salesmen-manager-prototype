import Button from "@/components/ui/Button";
import { addLocation } from "@/lib/http/mutations";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import { CaretLeft, MapPinPlus } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { primary } from "@/constants/Colors";

export default function AddStore() {
  const [name, setName] = useState("");
  const [marketName, setMarketName] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
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

  const handleRegionChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setRegion(e.nativeEvent.text);
  }

  const handleStateChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setState(e.nativeEvent.text);
  }

  const handleMarketNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setMarketName(e.nativeEvent.text);
  }

  const mutation = useMutation({
    mutationFn: addLocation,
    onSuccess: (data) => {
      console.log(data);
      alert('Store Added Successfully');
      setName('');
      setMarketName('');
      setAddress('');
      setRegion('');
      setState('');
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
      mutation.mutate({ name, marketName, address, latitude, longitude, region, state });
    } else {
      alert('Please retrieve the location first.');
    }
  };

  return (
    <ScrollView style={{ padding: 30, backgroundColor: "white", minHeight: '100%' }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10, backgroundColor: "#f2f2f2", borderRadius: 10 }}>
          <CaretLeft size={32} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={{ display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, marginTop: 30 }}>
        <MapPinPlus size={100} color={primary} weight="duotone" duotoneColor={primary} />
        <TextInput
          placeholder="Name"
          value={name}
          onChange={handleInputNameChange}
          style={style.input}
        />
        <TextInput
          placeholder="Market Name"
          value={marketName}
          onChange={handleMarketNameChange}
          style={style.input}
        />
        <TextInput
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
          style={style.input}
        />
        <TextInput
          placeholder="Region"
          value={region}
          onChange={handleRegionChange}
          style={style.input}
        />
        <TextInput
          placeholder="State"
          value={state}
          onChange={handleStateChange}
          style={style.input}
        />
        {
          mutation.isPending ? <ActivityIndicator size="large" color={primary} /> : <Button
            title="Add Store"
            btnStyle={{ width: '100%', backgroundColor: primary }}
            textStyle={{ color: 'white' }}
            onPress={handleAddStore}
          />
        }
      </View>
      <View style={{padding: 30}}></View>
    </ScrollView>
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
