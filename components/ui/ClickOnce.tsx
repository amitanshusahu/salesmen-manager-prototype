import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { primary } from '@/constants/Colors';

export default function ClickOnce({ children, isLoading }: { children: React.ReactNode, isLoading: boolean }) {

  if (!isLoading) {
    return (
      <>{children}</>
    )
  }

  else {
    return (
      <ActivityIndicator size="large" color={primary} />
    )
  }
}

const styles = StyleSheet.create({})