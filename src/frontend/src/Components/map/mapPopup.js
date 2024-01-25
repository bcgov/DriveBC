// React
import React from 'react';

// Third party packages
import EventTypeIcon from '../EventTypeIcon';
import FriendlyTime from '../FriendlyTime';
import parse from 'html-react-parser';

const displayCategoryMap = {
  closures: 'Closure',
  majorEvents: 'Major Delay',
  minorEvents: 'Minor Delay',
  futureEvents: 'Future Delay',
  roadConditions: 'Road Condition',
}

function convertDirection(direction) {
  switch (direction) {
      case "N":
          return "Northbound";
      case "W":
          return "Westbound";
      case "E":
          return "Eastbound";
      case "S":
          return "Southbound";
      case "BOTH":
          return "Both Directions";
      case "NONE":
          return " ";
      default:
          return " ";
  }
}

export function getEventPopup(eventFeature) {
  const eventData = eventFeature.ol_uid ? eventFeature.getProperties() : eventFeature;
  const severity = eventData.severity.toLowerCase();

  return (
    <div className={`popup popup--delay ${severity}`}>
      <div className="popup__title">
        <p className="bold name">{`${eventData.route_at} - ${eventData.route_display}`}</p>
        <p style={{'whiteSpace': 'pre-wrap'}} className="bold orientation">{convertDirection(eventData.direction)}</p>
      </div>

      <div className="popup__description">
        <div className="delay-type">
          <div className="bold delay-severity">
            <div className="delay-icon">
              <EventTypeIcon event={ eventData } />
            </div>

            <p className="bold">{ displayCategoryMap[eventData.display_category]}</p>
          </div>

          <p className="bold friendly-time--mobile">
            <FriendlyTime date={eventData.last_updated} />
          </p>
        </div>

        <div className="delay-details">
          <p className="bold friendly-time-desktop">
            <FriendlyTime date={eventData.last_updated} />
          </p>

          <p>{eventData.description}</p>
        </div>
      </div>
    </div>
  );
}

export function getFerryPopup(ferryFeature) {
  const ferryData = ferryFeature.getProperties();

  return (
    <div className={`popup popup--ferry`}>
      <div className="popup__title">
        <a href={ferryData.url} target="_blank" rel="noreferrer" className="bold name">{`${ferryData.title}`}</a>
      </div>

      <div className="popup__description">
        {ferryData.image_url &&
          <img src={ferryData.image_url} alt={ferryData.title} />
        }

        <div className="delay-details">
          <p>{parse(ferryData.description)}</p>
          <p>{parse(ferryData.seasonal_description)}</p>
          <p>{parse(ferryData.service_hours)}</p>
        </div>
      </div>
    </div>
  );
}
