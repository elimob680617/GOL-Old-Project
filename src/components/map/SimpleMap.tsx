import { FC } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

const icon = L.icon({ iconUrl: '/icons/map-pin.svg' });

interface ISimpleMapProps {
  markerPosition?: LatLngExpression;
  center?: LatLngExpression;
  zoom?: number;
}

const SimpleMap: FC<ISimpleMapProps> = (props) => {
  const { markerPosition, center, zoom = 8 } = props;
  return (
    <MapContainer zoomControl={false} style={{ height: '230px', width: '100%' }} center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition} icon={icon}>
          {/* <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup> */}
        </Marker>
      )}
    </MapContainer>
  );
};

export default SimpleMap;
