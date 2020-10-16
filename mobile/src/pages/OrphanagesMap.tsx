import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'

import mapMarker from '../assets/map-marker.png'
import { useNavigation } from '@react-navigation/native'

export default function OrphanagesMap() {
  const navigation = useNavigation()

  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  // get location
  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        alert(
          'Permissão para a localização negada\nNão é possível estimar sua localização'
        )
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({})

      setLatitude(latitude)
      setLongitude(longitude)
    })()
  }, [])

  if (latitude === 0 && longitude === 0) {
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
        <Text style={{ fontSize: 16, marginTop: 20 }}>Carregando mapa...</Text>
      </View>
    )
  }

  function handleNavigateToOrphanageDetails() {
    navigation.navigate('OrphanageDetails')
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        <Marker
          icon={mapMarker}
          coordinate={{ latitude, longitude }}
          calloutAnchor={{
            x: 2.7,
            y: 0.8,
          }}
        >
          <Callout tooltip onPress={handleNavigateToOrphanageDetails}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>Lar das meninas</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>2 orfanatos encontrados</Text>

        <TouchableOpacity
          style={styles.createOrphanageButton}
          onPress={() => {}}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    height: 56,
    paddingLeft: 24,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,

    backgroundColor: '#fff',
    borderRadius: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 5,
  },

  footerText: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_700Bold',
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
})
