// React
import React, { useEffect } from 'react';

// Navigation
import { useSearchParams } from 'react-router-dom';

// External imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faMountain,
  faRoad,
  faSnowflake,
  faTemperatureHalf,
  faWind,
} from '@fortawesome/pro-light-svg-icons';

// Internal imports
import FriendlyTime from '../../../shared/FriendlyTime';
import ShareURLButton from '../../../shared/ShareURLButton';

// Styling
import './LocalWeatherPanel.scss';

// Main component
export default function LocalWeatherPanel(props) {
  const { feature } = props;

  const weatherData = feature.getProperties();

  const [_searchParams, setSearchParams] = useSearchParams();

  // useEffect hooks
  useEffect(() => {
    setSearchParams(new URLSearchParams({ type: 'localWeather', id: weatherData.id }));
  }, [feature]);

  return (
    <div className="popup popup--road-weather" tabIndex={0}>
      <div className="popup__title">
        <div className="popup__title__icon">
          <FontAwesomeIcon icon={faTemperatureHalf} />
        </div>
        <p className="name popup__title__name">
          Local Weather
          <ShareURLButton type={`weather`}/>
        </p>
        
        <span className="sub-name">Weather Stations</span>
      </div>

      <div className="popup__content">
        <div className="popup__content__title">
          <p className="name">{weatherData.weather_station_name}</p>
          <p className="description">{weatherData.location_description}</p>
          <FriendlyTime date={weatherData.issuedUtc} asDate />
        </div>

        <div className="popup__content__description">
          {(weatherData.air_temperature || weatherData.road_temperature) && (
            <div className="temperatures">
              {weatherData.air_temperature && (
                <div className="temperature temperature--air">
                  <p className="label"><FontAwesomeIcon icon={faTemperatureHalf} /> Air</p>
                  <p className="data">{weatherData.air_temperature}&deg;</p>
                </div>
              )}

              {weatherData.road_temperature && (
                <div className="temperature temperature--road">
                  <p className="label"><FontAwesomeIcon icon={faRoad} /> Road</p>
                  <p className="data">{weatherData.road_temperature}&deg;</p>
                </div>
              )}
            </div>
          )}

          {(weatherData.elevation || weatherData.precipitation ||
            weatherData.snow || weatherData.average_wind || weatherData.maximum_wind) && (

            <div className="data-card-container">
              <p className="container-label">Conditions</p>

              <div className="data-card">
                {weatherData.elevation && (
                  <div className="data-card__row">
                    <div className="data-icon">
                      <FontAwesomeIcon className="icon" icon={faMountain} />
                    </div>
                    <p className="label">Elevation</p>
                    <p className="data">{weatherData.elevation}</p>
                  </div>
                )}

                {weatherData.precipitation && (
                  <div className="data-card__row">
                    <div className="data-icon">
                      <FontAwesomeIcon className="icon" icon={faDroplet} />
                    </div>
                    <p className="label">Precipitation (last 12 hours)</p>
                    <p className="data">{weatherData.precipitation}</p>
                  </div>
                )}

                {weatherData.snow && (
                  <div className="data-card__row">
                    <div className="data-icon">
                      <FontAwesomeIcon className="icon" icon={faSnowflake} />
                    </div>
                    <p className="label">Snow (last 12 hours)</p>
                    <p className="data">{weatherData.snow}</p>
                  </div>
                )}

                {(weatherData.average_wind || weatherData.maximum_wind) && (
                  <div className="data-card__row data-card__row group">
                    <div className="data-icon">
                      <FontAwesomeIcon className="icon" icon={faWind} />
                    </div>
                    <div className="data-group">
                      {weatherData.average_wind && (
                        <div className="data-group__row">
                          <p className="label">Average wind</p>
                          <p className="data">{weatherData.average_wind}</p>
                        </div>
                      )}
                      {weatherData.maximum_wind && (
                        <div className="data-group__row">
                          <p className="label">Maximum wind</p>
                          <p className="data">{weatherData.maximum_wind}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {weatherData.hourly_forecast_group && weatherData.hourly_forecast_group.length > 0 &&
            <div className="data-card-container">
              <p className="container-label">Road surface forecast</p>

              <div className="data-card hourly-forecast">
                {weatherData.hourly_forecast_group.map((forecast, index) => {
                  return forecast.ObservationTypeName == 'surfaceTemp' ? (
                    <div key={index} className="data-card__row data-card__row group">
                      <FriendlyTime date={forecast.TimestampUtc} timeOnly />
                      <p className="temperature">{forecast.Value}&deg;</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          }
        </div>

        <div className="popup__content__footer">
          <p>Temperatures displayed in Celcius (&deg;C) <br /></p>
          <p>
            Local weather is provided by local Ministry of Transportation and Infrastructure weather stations. <br />
            Forecasts courtesy of Weathernet.
          </p>
        </div>
      </div>
    </div>
  );
}
