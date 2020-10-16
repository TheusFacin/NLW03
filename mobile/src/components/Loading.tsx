import React from 'react'
import { ActivityIndicator, Dimensions, Text, View } from 'react-native'

interface LoadingProps {
  text?: string
}

export default function Loading({ text }: LoadingProps) {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
      }}
    >
      <ActivityIndicator size="large" color="#15c3d6" />
      {text && (
        <Text style={{ fontSize: 16, marginTop: 20 }}>Carregando mapa...</Text>
      )}
    </View>
  )
}
