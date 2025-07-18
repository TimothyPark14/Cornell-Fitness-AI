import { DateTime } from 'luxon';
import gymEquipment from '../data/gymEquipment';
import { gymLocations as gymLocationData, campusBuildings } from '../data/campusLocations';

interface GymEvent {
  title: string;
  start: DateTime;
  end: DateTime;
  location: string;
  nextLocation: string | null;
}

interface GymLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  equipment: string[];
}

// Build the combined gym data from imported locations
const gymLocations: GymLocation[] = gymLocationData.map(gym => ({
  name: gym.name,
  coordinates: gym.coordinates,
  equipment: gymEquipment[gym.name] || []
}));

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Get coordinates for a building name
function getBuildingCoordinates(buildingName: string): { lat: number; lng: number } | null {
  // Extract building name from full location (e.g., "Gates Hall 114" -> "Gates Hall")
  const buildingKey = Object.keys(campusBuildings).find(key => 
    buildingName.toLowerCase().includes(key.toLowerCase())
  );
  
  return buildingKey ? campusBuildings[buildingKey] : null;
}

// Calculate walking time (assuming 5 km/h walking speed)
function calculateWalkingTime(distanceInMeters: number): number {
  const walkingSpeed = 5 * 1000 / 60; // 5 km/h in meters per minute
  return Math.ceil(distanceInMeters / walkingSpeed); // Walking time in minutes
}

// Find the best gym location for a workout session
function findOptimalGym(event: GymEvent, userPreferences?: { requiredEquipment?: string[] }): string {
  const bufferTime = 10; // Minutes needed after workout (change)
  
  if (!event.nextLocation) {
    return 'Teagle';
  }

  const nextBuildingCoords = getBuildingCoordinates(event.nextLocation);
  if (!nextBuildingCoords) {
    console.warn(`Unknown building: ${event.nextLocation}, defaulting to Teagle`);
    return 'Teagle';
  }

  // Calculate scores for each gym
  const gymScores = gymLocations.map(gym => {
    const distance = calculateDistance(
      gym.coordinates.lat,
      gym.coordinates.lng,
      nextBuildingCoords.lat,
      nextBuildingCoords.lng
    );
    
    const walkingTime = calculateWalkingTime(distance);
    
    // Calculate time available after workout
    const workoutDuration = event.end.diff(event.start, 'minutes').minutes;
    const timeToNextEvent = event.nextLocation ? 
      15 : 
      30; // More buffer if no next event
    
    // Score factors
    let score = 100;
    
    // Distance penalty (higher penalty for longer walks)
    score -= (walkingTime * 2);
    
    // Time constraint penalty
    if (walkingTime + bufferTime > timeToNextEvent) {
      score -= 50; // Heavy penalty if too tight on time
    }
    
    // Gym-specific bonuses
    if (gym.name === 'Teagle') {
      score += 10; // Teagle has the most equipment
    }
    
    return {
      gym: gym.name,
      distance: Math.round(distance),
      walkingTime,
      score
    };
  });

  // Sort by score and return the best gym
  gymScores.sort((a, b) => b.score - a.score);
  
  console.log(`For next location ${event.nextLocation}:`, gymScores);
  
  return gymScores[0].gym;
}

// Main function to optimize all gym locations
export function optimizeGymLocations(
  gymEvents: GymEvent[],
  userPreferences?: { requiredEquipment?: string[] }
): GymEvent[] {
  return gymEvents.map(event => ({
    ...event,
    location: findOptimalGym(event, userPreferences),
    title: `Workout Session`
  }));
}

export function getGymInfo(gymName: string): GymLocation | undefined {
  return gymLocations.find(gym => gym.name === gymName);
}

// Helper function to estimate travel time between gym and building
export function getTravelTime(gymName: string, buildingName: string): number | null {
  const gym = gymLocations.find(g => g.name === gymName);
  const buildingCoords = getBuildingCoordinates(buildingName);
  
  if (!gym || !buildingCoords) {
    return null;
  }
  
  const distance = calculateDistance(
    gym.coordinates.lat,
    gym.coordinates.lng,
    buildingCoords.lat,
    buildingCoords.lng
  );
  
  return calculateWalkingTime(distance);
}