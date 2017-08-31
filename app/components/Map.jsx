import React from 'react';
import { withGoogleMap, GoogleMap, Marker, Circle, InfoWindow, } from "react-google-maps";
import canUseDOM from "can-use-dom";
import raf from "raf";





class Map extends React.Component {
  render() {
    const markers = this.props.markers || [];

    return (
      <div>
        <GoogleMap
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
          >
            {markers.map((marker, index) => (
              <Marker
                {...marker}
              />
            ))}
          </GoogleMap>
      </div>
    );
  }
}

export default withGoogleMap(Map);
