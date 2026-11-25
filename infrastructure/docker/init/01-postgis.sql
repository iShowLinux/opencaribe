-- Enables the geospatial extension. Approximate coordinates are stored as
-- numeric columns in Phase 0; a geometry(Point, 4326) column is deferred until
-- proximity search is implemented, so no unused infrastructure is introduced.
CREATE EXTENSION IF NOT EXISTS postgis;
