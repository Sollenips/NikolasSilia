/*
# Add lat/lng columns to stores table

## Overview
Adds latitude and longitude columns to the stores table so each studio
can be displayed as a marker on an interactive map of Athens.

## Modified Tables
### stores
- latitude (double precision, nullable) — geographic latitude
- longitude (double precision, nullable) — geographic longitude

## Security
- No policy changes needed; existing SELECT grant covers new columns.
*/

ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

-- Geocode all existing stores with their approximate Athens-area coordinates
UPDATE stores SET latitude = 37.9715, longitude = 23.7563 WHERE name = 'Athens Karate Dojo';
UPDATE stores SET latitude = 37.9347, longitude = 23.7620 WHERE name = 'Melodia Music Academy';
UPDATE stores SET latitude = 37.9585, longitude = 23.7640 WHERE name = 'Artemis Dance Studio';
UPDATE stores SET latitude = 37.9690, longitude = 23.7560 WHERE name = 'Kallithea Art Workshop';
UPDATE stores SET latitude = 37.9347, longitude = 23.7620 WHERE name = 'ZenFlow Yoga Studio';
UPDATE stores SET latitude = 37.9585, longitude = 23.7640 WHERE name = 'Glyfada Swim Club';
UPDATE stores SET latitude = 37.9650, longitude = 23.7720 WHERE name = 'Marousi Language Center';
UPDATE stores SET latitude = 37.9650, longitude = 23.7720 WHERE name = 'Glyfada Tennis Academy';
UPDATE stores SET latitude = 37.9715, longitude = 23.7563 WHERE name = 'Athens Hoops Academy';
UPDATE stores SET latitude = 37.9500, longitude = 23.7100 WHERE name = 'IronCore Fitness';
UPDATE stores SET latitude = 37.9380, longitude = 23.7890 WHERE name = 'StageLight Theater School';
UPDATE stores SET latitude = 37.8700, longitude = 23.7600 WHERE name = 'Athens Football Club';
