import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function SorryBox({text}: {text?: string}) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 30 }}>
      <Image
        source={require("@/assets/images/sorry.jpg")}
        style={{ width: 300, height: 300, resizeMode: 'cover' }}
      />
      <Text style={{color: "#aaa"}}>{text}</Text>
    </View>

  )
}

const styles = StyleSheet.create({})