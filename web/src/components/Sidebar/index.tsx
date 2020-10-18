import React from 'react';
import { IoMdMenu, IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router-dom';

import mapMarkerImg from '../../images/map-marker.svg';

import './styles.css';

const Sidebar: React.FC = () => {
  const { goBack } = useHistory();

  return (
    <>
      <button onClick={goBack} type="button" className="app-back-button">
        <IoIosArrowBack size={30} color="#17D6EB" />
      </button>
      <aside className="app-sidebar">
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <IoMdMenu size={24} color="#FFF" />
          </button>
        </footer>
      </aside>
    </>

  );
};

export default Sidebar;
