import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FiPlus, FiX } from 'react-icons/fi'

import Sidebar from '../components/Sidebar'
import mapIcon from '../utils/mapIcon'

import '../styles/pages/create-orphanage.css'
import api from '../services/api'
import { AxiosError } from 'axios'
import { useHistory } from 'react-router-dom'

interface ErrorResponseData {
  message: string
  errors: Array<{
    [key: string]: string[]
  }>
}

export default function CreateOrphanage() {
  const history = useHistory()

  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0])
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [openOnWeekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])

  const [previewImages, setPreviewImages] = useState<string[]>([])

  // get user position
  useEffect(() => {
    ;(() => {
      navigator.geolocation &&
        navigator.geolocation.getCurrentPosition((position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude])
          console.log(position)
        })
    })()
  }, [])

  function handleMapClick(e: LeafletMouseEvent) {
    const { lat, lng } = e.latlng

    setPosition({
      latitude: lat,
      longitude: lng,
    })
  }

  function handleSelectedImages(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    const selectedImages = Array.from(e.target.files)

    const allImages = [...images, ...selectedImages]

    setImages(allImages)

    const selectedImagesPreview = allImages.map((image) => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  function handleDeleteImage(index: number) {
    const allImages = Array.from(images)

    allImages.splice(index, 1)

    setImages(allImages)

    const selectedImagesPreview = Array.from(previewImages)
    selectedImagesPreview.splice(index, 1)

    setPreviewImages(selectedImagesPreview)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const { latitude, longitude } = position

    const data = new FormData()

    data.append('name', name)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('about', about)
    data.append('instructions', instructions)
    data.append('opening_hours', openingHours)
    data.append('open_on_weekends', String(openOnWeekends))

    images.forEach((image) => {
      data.append('images', image)
    })

    try {
      await api.post('orphanages', data)
      
      alert('Cadastro realizado com sucesso')
      history.push('/app')
    } catch (e) {
      console.log(e.response)
      const { errors } = e.response.data as ErrorResponseData
      let message = 'Não foi possível realizar o cadastro:\n'
  
      console.log(errors)
      console.log(typeof errors)

      for (let error in errors) {
        message += `\n${errors[error][0]}`
      }
  
      alert(message)
    }
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={userPosition}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && position.longitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image, index) => (
                  <div key={image} className="image">
                    <img src={image} alt={name} />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <FiX size={30} color="#ff669d" />
                    </button>
                  </div>
                ))}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input
                multiple
                onChange={handleSelectedImages}
                type="file"
                id="image[]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={
                    !openOnWeekends
                      ? 'active dont-open-on-weekends'
                      : 'dont-open-on-weekends'
                  }
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  )
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
