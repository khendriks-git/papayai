// Simulated meditators around the world
const LOCATIONS = [
  { city: 'Amsterdam', lat: 52.37, lng: 4.9 },
  { city: 'Tokyo', lat: 35.68, lng: 139.69 },
  { city: 'New York', lat: 40.71, lng: -74.01 },
  { city: 'London', lat: 51.51, lng: -0.13 },
  { city: 'Paris', lat: 48.86, lng: 2.35 },
  { city: 'Sydney', lat: -33.87, lng: 151.21 },
  { city: 'Berlin', lat: 52.52, lng: 13.41 },
  { city: 'Barcelona', lat: 41.39, lng: 2.15 },
  { city: 'Bali', lat: -8.41, lng: 115.19 },
  { city: 'Mumbai', lat: 19.08, lng: 72.88 },
  { city: 'São Paulo', lat: -23.55, lng: -46.63 },
  { city: 'Cape Town', lat: -33.93, lng: 18.42 },
  { city: 'Seoul', lat: 37.57, lng: 126.98 },
  { city: 'Stockholm', lat: 59.33, lng: 18.07 },
  { city: 'Vancouver', lat: 49.28, lng: -123.12 },
  { city: 'Kyoto', lat: 35.01, lng: 135.77 },
  { city: 'Copenhagen', lat: 55.68, lng: 12.57 },
  { city: 'Chiang Mai', lat: 18.79, lng: 98.98 },
  { city: 'Lisbon', lat: 38.72, lng: -9.14 },
  { city: 'Melbourne', lat: -37.81, lng: 144.96 },
  { city: 'Montreal', lat: 45.50, lng: -73.57 },
  { city: 'Vienna', lat: 48.21, lng: 16.37 },
  { city: 'Singapore', lat: 1.35, lng: 103.82 },
  { city: 'Buenos Aires', lat: -34.61, lng: -58.38 },
  { city: 'Oslo', lat: 59.91, lng: 10.75 },
  { city: 'Zurich', lat: 47.38, lng: 8.54 },
  { city: 'Dublin', lat: 53.33, lng: -6.25 },
  { city: 'Prague', lat: 50.08, lng: 14.44 },
  { city: 'Helsinki', lat: 60.17, lng: 24.94 },
  { city: 'Auckland', lat: -36.87, lng: 174.77 },
];

// Generate a stable set of simulated meditators that changes slowly
let cachedMeditators = null;
let lastRefresh = 0;

function generateMeditators() {
  const count = 8 + Math.floor(Math.random() * 6); // 8-13 meditators
  const shuffled = [...LOCATIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((loc, i) => ({
    id: i,
    city: loc.city,
    lat: loc.lat + (Math.random() - 0.5) * 0.5,
    lng: loc.lng + (Math.random() - 0.5) * 0.5,
    minutesRemaining: Math.floor(Math.random() * 25) + 2,
  }));
}

export function getSimulatedMeditators() {
  const now = Date.now();
  // Refresh every 45 seconds
  if (!cachedMeditators || now - lastRefresh > 45000) {
    cachedMeditators = generateMeditators();
    lastRefresh = now;
  }
  return cachedMeditators;
}

export function getTotalMeditators(simulatedList) {
  return simulatedList.length + 1; // +1 for the user themselves
}
