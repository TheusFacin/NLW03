import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'

import mapMarker from '../assets/map-marker.png'
import Loading from '../components/Loading'
import api from '../services/api'

interface Orphanage {
  id: number
  name: string
  latitude: number
  longitude: number
}

export default function OrphanagesMap() {
  const navigation = useNavigation()

  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])

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

      setLocation({ latitude, longitude })
    })()
  }, [])

  // get orphanages
  useFocusEffect(() => {
    ;(async () => {
      const response = await api.get('/orphanages')
      setOrphanages(response.data as Orphanage[])
    })()
  })

  if (location.latitude === 0 && location.longitude === 0)
    return <Loading text="Carregando mapa..." />

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id })
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition', { location })
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        {console.log(orphanages)}
        {orphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            coordinate={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
            }}
            calloutAnchor={{
              x: 2.7,
              y: 0.8,
            }}
          >
            <Callout
              tooltip
              onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{orphanage.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length === 0
            ? 'Nenhum orfanato encontrado'
            : orphanages.length === 1
            ? '1 orfanato encontrado'
            : `${orphanages.length} orfanatos encontrados`}
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
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
