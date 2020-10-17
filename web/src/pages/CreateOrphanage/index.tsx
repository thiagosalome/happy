/* eslint-disable camelcase */
import React, { useState, ChangeEvent } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

// Components
import Sidebar from '../../components/Sidebar';

// Utils
import mapIcon from '../../utils/mapIcon';

import './styles.css';
import api from '../../services/api';

type FormValues = {
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  images: FileList
}

export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [openOnWeekends, setOpenOnWeekends] = useState<boolean>(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const history = useHistory();

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages([
      ...images,
      ...selectedImages,
    ]);

    const selectedImagesPreview = selectedImages.map((image) => (
      URL.createObjectURL(image)
    ));

    setPreviewImages([
      ...previewImages,
      ...selectedImagesPreview,
    ]);
  }

  async function sendForm(data: FormValues) {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('about', data.about);
    formData.append('latitude', String(position.latitude));
    formData.append('longitude', String(position.longitude));
    formData.append('instructions', data.instructions);
    formData.append('opening_hours', data.opening_hours);
    formData.append('open_on_weekends', String(openOnWeekends));

    images.forEach((image) => {
      formData.append('images', image);
    });

    await api.post('orphanages', formData);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit(sendForm)} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-19.9914736, -43.9650054]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_BOX_TOKEN}`}
              />

              {
                position.latitude !== 0 && (
                  <Marker
                    interactive={false}
                    icon={mapIcon}
                    position={[position.latitude, position.longitude]}
                  />
                )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                ref={register({ required: 'Nome obrigatório' })}
                id="name"
                name="name"
              />
              { errors.name && <span className="input-block__error">{errors.name.message}</span> }
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre
                {' '}
                <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                ref={register({ required: 'Sobre obrigatório' })}
                id="about"
                name="about"
                maxLength={300}
              />
              { errors.about && <span className="input-block__error">{errors.about.message}</span> }
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map((image, index) => (
                    <img key={image} src={image} alt={`Imagem ${index}`} title={`Imagem ${index}`} />
                  ))
                }
                <label htmlFor="images" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input
                  ref={register({ required: 'Adicionar pelo menos uma imagem' })}
                  multiple
                  onChange={handleSelectImages}
                  type="file"
                  name="images"
                  id="images"
                />
              </div>
              { errors.images && <span className="input-block__error">{errors.images.message}</span> }
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                ref={register({ required: 'Instruções obrigatórias' })}
                id="instructions"
                name="instructions"
              />
              { errors.instructions && <span className="input-block__error">{errors.instructions.message}</span> }
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                ref={register({ required: 'Horário de funcionamento obrigatório' })}
                id="opening_hours"
                name="opening_hours"
              />
              { errors.opening_hours && <span className="input-block__error">{errors.opening_hours.message}</span> }
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={`${openOnWeekends ? 'active' : ''}`}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={`${!openOnWeekends ? 'active' : ''}`}
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
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
