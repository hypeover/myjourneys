"use client";

import React, { useState, useMemo } from "react";
import Map, { Source, Layer, Marker } from "@vis.gl/react-maplibre";
import maplibregl from "maplibre-gl";
import { getCurvedFlightPath } from "@/lib/geo";
import "maplibre-gl/dist/maplibre-gl.css";

// URL do granic państw (GeoJSON)
const COUNTRIES_GEOJSON_URL = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const WARSAW: [number, number] = [21.0122, 52.2297];
const NEW_YORK: [number, number] = [-74.0060, 40.7128];

export default function InteractiveFlightMap() {
  // Stan przechowujący ID klikniętego kraju (np. "POL", "USA")
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const flightGeoJson = useMemo(() => getCurvedFlightPath(WARSAW, NEW_YORK), []);

  // 1. Styl dla wszystkich krajów (tło)
  const countriesLayerStyle: any = {
    id: "countries-fill",
    type: "fill",
    paint: {
      "fill-color": "#e2e8f0", // jasnoszary (slate-200)
      "fill-opacity": 0.6,
      "fill-outline-color": "#94a3b8", // granice (slate-400)
    },
  };

  // 2. Styl dla ZAZNACZONEGO kraju
  const selectedCountryLayerStyle: any = {
    id: "selected-country-fill",
    type: "fill",
    paint: {
      "fill-color": "#22c55e", // zielony (green-500)
      "fill-opacity": 0.5,
      "fill-outline-color": "#15803d",
    },
    // Filtrujemy dane tak, aby ta warstwa pokazała TYLKO kliknięty kraj
    filter: ["==", "id", selectedCountryId || ""],
  };

  // Styl linii lotu
  const lineLayerStyle: any = {
    id: "flight-path",
    type: "line",
    paint: {
      "line-color": "#3b82f6",
      "line-width": 3,
      "line-dasharray": [2, 2],
    },
  };

  // Funkcja obsługująca kliknięcie w mapę
  const onMapClick = (event: any) => {
    // Sprawdzamy, czy użytkownik kliknął w warstwę z krajami
    const features = event.target.queryRenderedFeatures(event.point, {
      layers: ["countries-fill"],
    });

    if (features && features.length > 0) {
      const clickedCountry = features[0];
      const countryId = clickedCountry.id; // Np. "POL"
      const countryName = clickedCountry.properties.name;

      console.log(`Kliknięto: ${countryName} (${countryId})`);
      setSelectedCountryId(countryId);
    } else {
      // Kliknięcie w wodę / poza krajem resetuje wybór
      setSelectedCountryId(null);
    }
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Map
        initialViewState={{ longitude: -20, latitude: 45, zoom: 2 }}
        mapLib={maplibregl}
        // Używamy "pustego" stylu bazowego (tylko woda), bo kraje rysujemy sami z GeoJSON
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onClick={onMapClick}
        interactiveLayerIds={["countries-fill"]} // Informuje mapę, że ta warstwa reaguje na kursor
      >
        {/* WARSTWA KRAJÓW */}
        <Source id="countries-data" type="geojson" data={COUNTRIES_GEOJSON_URL}>
          <Layer {...countriesLayerStyle} />
          <Layer {...selectedCountryLayerStyle} />
        </Source>

        {/* WARSTWA LINII LOTU */}
        <Source id="flight-data" type="geojson" data={flightGeoJson}>
          <Layer {...lineLayerStyle} />
        </Source>

        {/* MARKERY */}
        <Marker longitude={WARSAW[0]} latitude={WARSAW[1]}>
          <div style={{ width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%" }} />
        </Marker>
        <Marker longitude={NEW_YORK[0]} latitude={NEW_YORK[1]}>
          <div style={{ width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%" }} />
        </Marker>
      </Map>
    </div>
  );
}