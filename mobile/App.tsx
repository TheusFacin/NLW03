import React from 'react'
import {
  View,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { useFonts } from 'expo-font'
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito'
import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  })

  if (!fontsLoaded) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: Dimensions.get('window').height,
        }}
      >
        <StatusBar backgroundColor="#000" />
        <ActivityIndicator size="large" color="#15c3d6" />
      </View>
    )
  }

  return (
    <Routes />
  )
}
