import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SorryBox from '@/components/ui/SorryBox'

export default function notification() {
  return (
    <View style={{padding: 30, backgroundColor: "white", minHeight: "100%"}}>
      <SorryBox text="No notification available" />
    </View>
  )
}

const styles = StyleSheet.create({})