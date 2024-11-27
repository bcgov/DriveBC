// React
import React from 'react';

// External imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleExclamation,
} from '@fortawesome/pro-solid-svg-icons';

// Styling
import './NoRouteFound.scss';

export default function NoRouteFound(props) {
  const { searchedRoutes } = props;

  // Rendering
  return (
    <div className={`no-route-found-container ${!searchedRoutes.length ? 'open' : ''}`}>
      <FontAwesomeIcon icon={faCircleExclamation} />
      <span>Routes outside of BC are not possible at the moment.</span>
    </div>
  );
}
