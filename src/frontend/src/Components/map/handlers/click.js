import { setEventStyle, setZoomPan } from '../helpers';
import trackEvent from '../../shared/TrackEvent.js';

import { isRestStopClosed } from '../../data/restStops.js';

// Styling
import {
  cameraStyles,
  ferryStyles,
  roadWeatherStyles,
  regionalStyles,
  restStopStyles,
  restStopClosedStyles,
  restStopTruckStyles,
  restStopTruckClosedStyles,
} from '../../data/featureStyleDefinitions.js';

// Click states
export const resetClickedStates = (
  targetFeature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // No features were clicked before, do nothing
  if (!clickedFeatureRef.current) {
    return;
  }

  // Workaround for the case where advisories are clicked
  if (!clickedFeatureRef.current.get) {
    updateClickedFeature(null);
    return;
  }

  // Reset feature if target feature does not equal to it or its altFeature
  if (
    !targetFeature ||
    (targetFeature != clickedFeatureRef.current &&
      targetFeature != clickedFeatureRef.current.get('altFeature'))
  ) {
    switch (clickedFeatureRef.current.get('type')) {
      case 'camera':
        clickedFeatureRef.current.setStyle(cameraStyles['static']);
        clickedFeatureRef.current.set('clicked', false);
        updateClickedFeature(null);
        break;
      case 'event': {
        setEventStyle(clickedFeatureRef.current, 'static');
        setEventStyle(
          clickedFeatureRef.current.get('altFeature') || [],
          'static',
        );
        clickedFeatureRef.current.set('clicked', false);

        // Set alt feature to not clicked
        const altFeatureList = clickedFeatureRef.current.get('altFeature');
        if (altFeatureList) {
          const altFeature =
            altFeatureList instanceof Array
              ? altFeatureList[0]
              : altFeatureList;
          altFeature.set('clicked', false);
        }

        updateClickedFeature(null);
        break;
      }
      case 'ferry':
        clickedFeatureRef.current.setStyle(ferryStyles['static']);
        clickedFeatureRef.current.set('clicked', false);
        updateClickedFeature(null);
        break;
      case 'currentWeather':
        clickedFeatureRef.current.setStyle(roadWeatherStyles['static']);
        clickedFeatureRef.current.set('clicked', false);
        updateClickedFeature(null);
        break;
      case 'regionalWeather':
        clickedFeatureRef.current.setStyle(regionalStyles['static']);
        clickedFeatureRef.current.set('clicked', false);
        updateClickedFeature(null);
        break;
      case 'largeRestStop':
      case 'restStop': {
        const isClosed = isRestStopClosed(
          clickedFeatureRef.current.values_.properties,
        );
        const isLargeVehiclesAccommodated =
          clickedFeatureRef.current.values_.properties
            .ACCOM_COMMERCIAL_TRUCKS === 'Yes'
            ? true
            : false;
        if (isClosed) {
          if (isLargeVehiclesAccommodated) {
            clickedFeatureRef.current.setStyle(
              restStopTruckClosedStyles['static'],
            );
          } else {
            clickedFeatureRef.current.setStyle(restStopClosedStyles['static']);
          }
        } else {
          if (isLargeVehiclesAccommodated) {
            clickedFeatureRef.current.setStyle(restStopTruckStyles['static']);
          } else {
            clickedFeatureRef.current.setStyle(restStopStyles['static']);
          }
        }
        clickedFeatureRef.current.set('clicked', false);
        updateClickedFeature(null);
        break;
      }
    }
  }
};

const camClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  mapView,
  isCamDetail,
  loadCamDetails,
) => {
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked camera feature
  feature.setStyle(cameraStyles['active']);
  feature.setProperties({ clicked: true }, true);

  updateClickedFeature(feature);

  if (isCamDetail) {
    setZoomPan(mapView, null, feature.getGeometry().getCoordinates());
    loadCamDetails(feature.getProperties());
  }
};

const eventClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // reset previous clicked feature
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked event feature
  setEventStyle(feature, 'active');
  setEventStyle(feature.get('altFeature') || [], 'active');
  feature.set('clicked', true);

  // Set alt feature to clicked
  const altFeatureList = feature.get('altFeature');
  if (altFeatureList) {
    const altFeature =
      altFeatureList instanceof Array ? altFeatureList[0] : altFeatureList;
    altFeature.set('clicked', true);
  }

  updateClickedFeature(feature);
};

const ferryClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // reset previous clicked feature
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked ferry feature
  feature.setStyle(ferryStyles['active']);
  feature.setProperties({ clicked: true }, true);
  updateClickedFeature(feature);
};

const weatherClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // reset previous clicked feature
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked ferry feature
  feature.setStyle(roadWeatherStyles['active']);
  feature.setProperties({ clicked: true }, true);
  updateClickedFeature(feature);
};

const regionalClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // reset previous clicked feature
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked ferry feature
  feature.setStyle(regionalStyles['active']);
  feature.setProperties({ clicked: true }, true);
  updateClickedFeature(feature);
};

const restStopClickHandler = (
  feature,
  clickedFeatureRef,
  updateClickedFeature,
  isCamDetail,
) => {
  // reset previous clicked feature
  resetClickedStates(
    feature,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );

  // set new clicked rest stop feature
  const isClosed = isRestStopClosed(feature.values_.properties);
  const isLargeVehiclesAccommodated =
    feature.values_.properties.ACCOM_COMMERCIAL_TRUCKS === 'Yes' ? true : false;
  if (isClosed) {
    if (isLargeVehiclesAccommodated) {
      feature.setStyle(restStopTruckClosedStyles['active']);
    } else {
      feature.setStyle(restStopClosedStyles['active']);
    }
  } else {
    if (isLargeVehiclesAccommodated) {
      feature.setStyle(restStopTruckStyles['active']);
    } else {
      feature.setStyle(restStopStyles['active']);
    }
  }
  feature.setProperties({ clicked: true }, true);
  updateClickedFeature(feature);
};

export const pointerClickHandler = (
  features,
  clickedFeatureRef,
  updateClickedFeature,
  mapView,
  isCamDetail,
  loadCamDetails,
) => {
  if (features.length) {
    const clickedFeature = features[0];
    switch (clickedFeature.getProperties()['type']) {
      case 'camera':
        trackEvent(
          'click',
          'map',
          'camera',
          clickedFeature.getProperties().name,
        );
        camClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          mapView,
          isCamDetail,
          loadCamDetails,
        );
        return;
      case 'event':
        trackEvent(
          'click',
          'map',
          'event',
          clickedFeature.getProperties().display_category,
          clickedFeature.getProperties().id,
        );
        eventClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          isCamDetail,
        );
        return;
      case 'ferry':
        trackEvent(
          'click',
          'map',
          'ferry',
          clickedFeature.getProperties().title,
        );
        ferryClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          isCamDetail,
        );
        return;
      case 'currentWeather':
        trackEvent(
          'click',
          'map',
          'weather',
          clickedFeature.getProperties().weather_station_name,
        );
        weatherClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          isCamDetail,
        );
        return;
      case 'regionalWeather':
        trackEvent(
          'click',
          'map',
          'regional weather',
          clickedFeature.getProperties().name,
        );
        regionalClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          isCamDetail,
        );
        return;
      case 'largeRestStop':
      case 'restStop':
        trackEvent(
          'click',
          'map',
          'rest stop',
          clickedFeature.getProperties().properties.REST_AREA_NAME,
        );
        restStopClickHandler(
          clickedFeature,
          clickedFeatureRef,
          updateClickedFeature,
          isCamDetail,
        );
        return;
    }
  }

  // Close popups if clicked on blank space
  resetClickedStates(
    null,
    clickedFeatureRef,
    updateClickedFeature,
    isCamDetail,
  );
};
