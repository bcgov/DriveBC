from pathlib import Path

import environ

# Base dir and env
BASE_DIR = Path(__file__).resolve().parents[4]
env = environ.Env()
environ.Env.read_env(BASE_DIR / '.env', overwrite=True)

# Feed API Settings
DRIVEBC_WEBCAM_API_BASE_URL = env("DRIVEBC_WEBCAM_API_BASE_URL")
DRIVEBC_OPEN_511_API_BASE_URL = env("DRIVEBC_OPEN_511_API_BASE_URL")
DRIVEBC_INLAND_FERRY_API_BASE_URL = env("DRIVEBC_INLAND_FERRY_API_BASE_URL")
DRIVEBC_DIT_API_BASE_URL = env("DRIVEBC_DIT_API_BASE_URL")
# Weather API Settings
WEATHER_CLIENT_ID=env("WEATHER_CLIENT_ID")
WEATHER_CLIENT_SECRET=env("WEATHER_CLIENT_SECRET")
DRIVEBC_WEATHER_API_BASE_URL=env("DRIVEBC_WEATHER_API_BASE_URL")
DRIVEBC_WEATHER_AREAS_API_BASE_URL=env("DRIVEBC_WEATHER_AREAS_API_BASE_URL")
DRIVEBC_WEATHER_API_TOKEN_URL=env("DRIVEBC_WEATHER_API_TOKEN_URL")