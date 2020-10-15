import React, { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'

import mapMarkerImg from '../assets/map-marker.svg'
import api from '../services/api'

import '../styles/pages/orphanages-map.css'

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [48, 58],
  iconAnchor: [24, 58],
  popupAnchor: [175, 10],
})

interface Orphanage {
  id: number
  name: string
  latitude: number
  longitude: number
}

function OrphanagesMap() {
  const [pos, setPos] = useState<[number, number]>([0, 0])
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])

  // get orphanages
  useEffect(() => {
    ;(async () => {
      const response = await api.get('/orphanages')
      const orphs = response.data as Orphanage[]
      setOrphanages(orphs)
    })()
  }, [])

  // get position
  useEffect(() => {
    ;(() => {
      navigator.geolocation &&
        navigator.geolocation.getCurrentPosition((position) => {
          setPos([position.coords.latitude, position.coords.longitude])
          console.log(position)
        })
    })()
  }, [])

  return (
    <div id="page-map">
      <aside>
        <header>
          <Link to="/">
            <img src={mapMarkerImg} alt="Happy" />
          </Link>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>São Paulo</strong>
          <span>São Paulo</span>
        </footer>
      </aside>

      <Map center={pos} zoom={16} style={{ width: '100%', height: '100%' }}>
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />
        {orphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            icon={mapIcon}
            position={[orphanage.latitude, orphanage.longitude]}
          >
            <Popup
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className="map-popup"
            >
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight size={20} color="#fff" />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  )
}

export default OrphanagesMap
