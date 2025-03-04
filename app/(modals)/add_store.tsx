import Button from "@/components/ui/Button";
import { addLocation } from "@/lib/http/mutations";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import { CaretLeft, MapPinPlus } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { primary } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import ClickOnce from "@/components/ui/ClickOnce";

export default function AddStore() {
  const [name, setName] = useState("");
  const [marketName, setMarketName] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [storeType, setStoreType] = useState<"RETAILER" | "WHOLESALER" | "DISTRIBUTOR">("RETAILER");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    onError: (error: {
      response: { data: { msg: string } };
    }) => {
      console.error(error);
      alert(error.response.data.msg);
    },
    onSettled: () => { setLoading(false) }
  });

  const handleAddStore = async () => {
    setLoading(true);
    const location = await getLocation();

    if (location) {
      const { latitude, longitude } = location;
      if (name != "" || marketName != "" || address != "" || region != "" || state != "")
        mutation.mutate({ name, marketName, address, latitude, longitude, region, state, storeType });
      else {
        alert('Please fill all the fields');
        setLoading(false);
      }
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

      <View style={{ display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, marginTop: 10 }}>
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
        <View style={{ width: '100%', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 }}>
          <Picker
            selectedValue={storeType}
            onValueChange={(itemValue) => setStoreType(itemValue)}
            style={{ height: 50, width: '100%' }}
            mode='dropdown'
          >
            <Picker.Item label="Retailer" value="RETAILER" />
            <Picker.Item label="Wholesaler" value="WHOLESALER" />
            <Picker.Item label="Distributor" value="DISTRIBUTOR" />
          </Picker>
        </View>
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
        <ClickOnce isLoading={loading}>
          <Button
            title="Add Store"
            btnStyle={{ width: '100%', backgroundColor: primary }}
            textStyle={{ color: 'white' }}
            onPress={handleAddStore}
          />
        </ClickOnce>
      </View>
      <View style={{ padding: 30 }}></View>
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
