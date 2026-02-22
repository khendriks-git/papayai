import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { getSimulatedMeditators } from '../utils/meditators';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldMap({ isUserMeditating }) {
  const [meditators, setMeditators] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    setMeditators(getSimulatedMeditators());
    const interval = setInterval(() => {
      setMeditators(getSimulatedMeditators());
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const totalCount = meditators.length + (isUserMeditating ? 1 : 0);

  return (
    <div className="worldmap-card">
      <div className="worldmap-header">
        <h2 className="worldmap-title">Wereldwijd mediteren</h2>
        <span className="meditator-count">
          <span className="count-dot" />
          {totalCount} mensen mediteren nu
        </span>
      </div>

      <div className="map-container">
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 140 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--map-land)"
                  stroke="var(--map-border)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {meditators.map(m => (
            <Marker
              key={m.id}
              coordinates={[m.lng, m.lat]}
              onMouseEnter={() => setTooltip(m)}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle r={4} fill="var(--accent)" opacity={0.7} className="meditator-dot" />
              <circle r={8} fill="var(--accent)" opacity={0.15} className="meditator-pulse" />
            </Marker>
          ))}

          {isUserMeditating && (
            <Marker coordinates={[4.9, 52.37]}>
              <circle r={5} fill="var(--accent-warm)" opacity={0.9} className="meditator-dot" />
              <circle r={12} fill="var(--accent-warm)" opacity={0.2} className="meditator-pulse" />
            </Marker>
          )}
        </ComposableMap>

        {tooltip && (
          <div className="map-tooltip">
            <strong>{tooltip.city}</strong>
            <span>{tooltip.minutesRemaining} min resterend</span>
          </div>
        )}
      </div>

      <div className="worldmap-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--accent)' }} />
          Mediteerders wereldwijd
        </span>
        {isUserMeditating && (
          <span className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--accent-warm)' }} />
            Jij
          </span>
        )}
      </div>
    </div>
  );
}
