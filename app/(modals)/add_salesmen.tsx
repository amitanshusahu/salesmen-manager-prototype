import { StyleSheet, TextInput, View, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { addSalesMan } from '@/lib/http/mutations';
import { useMutation } from '@tanstack/react-query';
import { primary } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { At, CaretLeft } from 'phosphor-react-native';
import { Picker } from '@react-native-picker/picker';
import ClickOnce from '@/components/ui/ClickOnce';

export default function AddSalesmen() {
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [salesManType, setSalesManType] = useState<"VANSALES" | "PRESELLER" | "MERCHANDISER" | "DILIVERY">("VANSALES");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleInputNameChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setName(e.nativeEvent.text);
  };

  const handleInputUidChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setUid(e.nativeEvent.text);
  };

  const mutation = useMutation({
    mutationFn: addSalesMan,
    onSuccess: (data) => {
      console.log(data);
      alert('Salesman Added');
      setName('');
      setUid('');
    },
    onError: (error) => {
      console.log(error);
      alert('Error');
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleAddSalesmen = () => {
    setLoading(true);
    console.log(name, uid);
    if (name != "" && uid != "")
      mutation.mutate({ name, userid: uid, salesManType });
    else {
      alert("Please fill all fields");
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 30, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10, backgroundColor: "#f2f2f2", borderRadius: 10 }}>
          <CaretLeft size={32} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={{ display: 'flex', alignItems: 'center', minHeight: '100%', gap: 20, marginTop: 100 }}>
        <At size={100} />
        <TextInput
          placeholder="name"
          value={name}
          onChange={handleInputNameChange}
          style={style.input}
        />
        <TextInput
          placeholder="phone"
          value={uid}
          onChange={handleInputUidChange}
          style={style.input}
          keyboardType="numeric"
        />
        <View style={{ width: '100%', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 }}>
          <Picker
            selectedValue={salesManType}
            onValueChange={(itemValue) => setSalesManType(itemValue)}
            style={{ height: 50, width: '100%' }}
            mode='dropdown'
          >
            <Picker.Item label="Van Sales" value="VANSALES" />
            <Picker.Item label="Pre Sales" value="PRESELLER" />
            <Picker.Item label="Merchandiser" value="MERCHANDISER" />
            <Picker.Item label="Delivery" value="DILIVERY" />
          </Picker>
        </View>
        <ClickOnce isLoading={loading}>
          <Button
            title="Add Salesman"
            btnStyle={{ width: '100%', backgroundColor: primary }}
            textStyle={{ color: 'white' }}
            onPress={handleAddSalesmen}
          />
        </ClickOnce>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    fontSize: 18,
  },
});
