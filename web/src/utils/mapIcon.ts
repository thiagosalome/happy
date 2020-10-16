import Leaflet from 'leaflet'
import mapMarkerImg from '../images/map-marker.svg';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68], // [width, height]
  iconAnchor: [29, 68], // [eixo x, eixo y]
  popupAnchor: [170, 2]
})

export default mapIcon