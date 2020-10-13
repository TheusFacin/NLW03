import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import mapMarkerImg from '../assets/map-marker.svg'

import '../styles/pages/orphanages-map.css'

function OrphanagesMap() {
  const [pos, setPos] = useState<[number, number]>([0, 0])

  useEffect(() => {
    ;(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position)
          setPos([position.coords.latitude, position.coords.longitude])
        })
      }
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

      <Map
        center={pos}
        zoom={17}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />
      </Map>

      <Link to="" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  )
}

export default OrphanagesMap
