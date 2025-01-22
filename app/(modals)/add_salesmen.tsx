import { StyleSheet, TextInput, View, NativeSyntheticEvent, TextInputChangeEventData, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { addSalesMan } from '@/lib/http/mutations';
import { useMutation } from '@tanstack/react-query';
import { primary } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { At, CaretLeft } from 'phosphor-react-native';

export default function AddSalesmen() {
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const router = useRouter();

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
  });

  const handleAddSalesmen = () => {
    console.log(name, uid);
    mutation.mutate({ name, userid: uid });
  };

  return (
    <View style={{ padding: 30, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <TouchableOpacity onPress={() => router.back()}>
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
        <Button
          title="Add Salesman"
          btnStyle={{ width: '100%', backgroundColor: primary }}
          textStyle={{ color: 'white' }}
          onPress={handleAddSalesmen}
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
    width: '100%',
    fontSize: 18,
  },
});
