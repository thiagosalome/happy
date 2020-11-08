import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import api from '../../services/api'
import mapMarker from '../../images/map-marker.png'

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

const OrphanagesMap: React.FC = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation()

  useFocusEffect(() => {
    async function getOrphanages() {
      const response = await api.get('orphanages');
      setOrphanages(response.data);
    }

    getOrphanages();
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Tanto os dispositivos Android quanto IOS vão utilizar o Google Maps
        style={styles.map}
        initialRegion={{ latitude: -19.9862763, longitude: -43.9673883, latitudeDelta: 0.008, longitudeDelta: 0.008}}
      >
        {
          orphanages.map(orphanage => (
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude
              }}
              calloutAnchor={{
                x: 2.7,
                y: 0.8
              }}
            >
              <Callout
                tooltip={true} // Fala que a estilização do Callout será feita do zero
                onPress={() => navigation.navigate('OrphanageDetails', { id: orphanage.id })}
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
          ))
        }
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanato{orphanages.length > 1 ? 's' : ''} encontrado{orphanages.length > 1 ? 's' : ''}</Text>

        <RectButton style={styles.createOrphanageButton} onPress={() => navigation.navigate('SelectMapPosition')}>
          <Feather name='plus' size={20} color='#fff' />
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
    height: Dimensions.get('window').height
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold'
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  footerText: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_700Bold'
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center' 
  }
});


export default OrphanagesMap;