import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import mapMarkerImg from '../../images/map-marker.svg';

import './styles.css';

const Sidebar: React.FC = () => {
  const { goBack } = useHistory();

  return (
    <>
      <button type="button" className="app-sidebar-button">
        <IoMdMenu size={30} color="#17D6EB" />
      </button>
      <aside className="app-sidebar">
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside>
    </>

  );
};

export default Sidebar;
