// Third party packages
import { lineString, bbox } from "@turf/turf";

// Openlayers
import { Circle } from 'ol/geom.js';
import { fromLonLat, transformExtent } from 'ol/proj';
import { Style } from 'ol/style.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

// Styling
import { eventStyles } from '../data/featureStyleDefinitions.js';

// Static assets
export const getEventIcon = (event, state) => {
  const severity = event.get('severity').toLowerCase();
  const type = event.get('event_type').toLowerCase();
  const geometry = event.getGeometry().getType();
  if (geometry === 'Point') {
    if (severity === 'major') {
      switch (type) {
        case 'incident':
          return eventStyles['major_incident'][state];
        case 'construction':
          return eventStyles['major_construction'][state];
        case 'special_event':
          return eventStyles['major_special_event'][state];
        case 'weather_condition':
          return eventStyles['major_weather_condition'][state];
        default:
          return eventStyles['major_incident'][state];
      }
    } else {
      switch (type) {
        case 'incident':
          return eventStyles['incident'][state];
        case 'construction':
          return eventStyles['construction'][state];
        case 'special_event':
          return eventStyles['special_event'][state];
        case 'weather_condition':
          return eventStyles['weather_condition'][state];
        default:
          return eventStyles['incident'][state];
      }
    }
  } else {
    return eventStyles['segments'][state];
  }
};

// Map transformation
export const transformFeature = (feature, sourceCRS, targetCRS) => {
  const clone = feature.clone();
  clone.getGeometry().transform(sourceCRS, targetCRS);
  return clone;
};

// Zoom and pan
export const fitMap = (route, mapView) => {
  const routeBbox = bbox(lineString(route));
  const routeExtent = transformExtent(routeBbox,'EPSG:4326','EPSG:3857');

  if (mapView.current) {
    mapView.current.fit(routeExtent, { duration: 1000 });
  }
}

export const setZoomPan = (mapView, zoom, panCoords) => {
  if (!mapView.current) {
    return;
  }

  const args = {
    duration: 250
  };

  if (zoom) {
    args.zoom = zoom;
  }

  if (panCoords) {
    args.center = panCoords;
  }

  mapView.animate(args);
};

export const zoomIn = (mapView) => {
  if (!mapView.current) {
    return;
  }

  setZoomPan(mapView, mapView.getZoom() + 1);
}

export const zoomOut = (mapView) => {
  if (!mapView.current) {
    return;
  }

  setZoomPan(mapView, mapView.getZoom() - 1);
}

// Geometry
export const getCameraCircle = (camera) => {
  if (!camera) {
    return {};
  }

  if (typeof camera === 'string') {
    camera = JSON.parse(camera);
  }
  const circle = new Circle(fromLonLat(camera.location.coordinates), 5000);
  const circleFeature = new Feature({
    geometry: circle,
  });

  circleFeature.setStyle(
    new Style({
      renderer(coordinates, state) {
        const [[x, y], [x1, y1]] = coordinates;
        const ctx = state.context;
        const dx = x1 - x;
        const dy = y1 - y;
        const radius = Math.sqrt(dx * dx + dy * dy);

        const innerRadius = 0;
        const outerRadius = radius * 1.4;

        const gradient = ctx.createRadialGradient(
          x,
          y,
          innerRadius,
          x,
          y,
          outerRadius,
        );
        gradient.addColorStop(0, 'rgba(255,0,0,0)');
        gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
        gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.strokeStyle = 'rgba(255,0,0,1)';
        ctx.stroke();
      },
    }),
  );

  const radiusLayer = new VectorLayer({
    source: new VectorSource({
      features: [circleFeature],
    }),
  });

  return {
    circle: circle,
    radiusLayer: radiusLayer,
  };
}

// Location pins
export const blueLocationMarkup = `
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" id="svg-container">
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="40%" style="stop-color:#f32947;stop-opacity:0.5" />
        <stop offset="40%" style="stop-color:#ed6f82;stop-opacity:0.5" />
      </linearGradient>
    </defs>
    <circle id="circle1" cx="44" cy="44" r="44" fill="url(#gradient1)"/>
    <defs>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="100%" style="stop-color:#f32947;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ed6f82;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="44" cy="44" r="16" fill="url(#gradient2)" stroke="white" stroke-width="2" />
  </svg>
`;

export const redLocationMarkup = `
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" id="svg-container">
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="40%" style="stop-color:#2790F3;stop-opacity:0.5" />
        <stop offset="40%" style="stop-color:#7496EC;stop-opacity:0.5" />
      </linearGradient>
    </defs>
    <circle id="circle1" cx="44" cy="44" r="44" fill="url(#gradient1)"/>
    <defs>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="100%" style="stop-color:#2970F3;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#7496EC;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="44" cy="44" r="16" fill="url(#gradient2)" stroke="white" stroke-width="2" />
  </svg>
`;

export const setLocationPin = (coordinates, svgMarkup, mapRef, pinRef) => {
  const svgImage = new Image();
  svgImage.src =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup);

  // Create an overlay for the marker
  const pinOverlay = new Overlay({
    position: fromLonLat(coordinates),
    positioning: 'center-center',
    element: svgImage,
    stopEvent: false, // Allow interactions with the overlay content
  });

  if (pinRef) {
    pinRef.current = pinOverlay;
  }

  mapRef.current.addOverlay(pinOverlay);
  mapRef.current.on('moveend', function (event) {
    const newZoom = mapRef.current.getView().getZoom();
    // Calculate new marker size based on the zoom level
    const newSize = 44 * (newZoom / 10);
    svgImage.style.width = newSize + 'px';
    svgImage.style.height = newSize + 'px';
  });
}
