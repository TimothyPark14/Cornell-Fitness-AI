// data/campusLocations.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GymLocation {
  name: string;
  coordinates: Coordinates;
  alternateNames?: string[]; // For different ways to refer to the gym
}

// Cornell gym locations with GPS coordinates
export const gymLocations: GymLocation[] = [
  {
    name: 'Teagle',
    coordinates: { lat: 42.446874, lng: -76.479344 }, // TODO: Replace with actual coordinates
    alternateNames: ['Teagle Hall', 'Teagle Down', 'Teagle Up']
  },
  {
    name: 'Toni Morrison',
    coordinates: { lat: 42.455365, lng: -76.474725 }, // TODO: Replace with actual coordinates
    alternateNames: ['Morrison', 'Toni Morrison Hall']
  },
  {
    name: 'Noyes',
    coordinates: { lat: 42.448396, lng: -76.481089 }, // TODO: Replace with actual coordinates
    alternateNames: ['Noyes Community Recreation Center', 'Noyes Center']
  },
  {
    name: 'Helen Newman',
    coordinates: { lat: 42.444283, lng: -76.477045 }, // TODO: Replace with actual coordinates
    alternateNames: ['Helen Newman Hall', 'HNH']
  }
];

// Common Cornell buildings and their coordinates
export const campusBuildings: Record<string, Coordinates> = {
  // Engineering Quad
  'Gates Hall': { lat: 42.444995, lng: -76.480873 },
  'Duffield Hall': { lat: 42.444885, lng: -76.482675 },
  'Duffield Atrium': { lat: 42.444885, lng: -76.482675 },
  'Phillips Hall': { lat: 42.444747, lng: -76.481926 },
  'Upson Hall': { lat: 42.444, lng: -76.4822 },
  'Rhodes Hall': { lat: 42.443282, lng: -76.481056 },
  'Hollister Hall': { lat: 42.444390, lng: -76.484710 },
  'Kimball Hall': { lat: 42.444500, lng: -76.483000 }, 
  'Thurston Hall': { lat: 42.444300, lng: -76.483500 }, 
  'Carpenter Hall': { lat: 42.4448, lng: -76.4841 },
  
  // Arts Quad
  'Olin Hall': { lat: 42.445076, lng: -76.484165 },
  'Goldwin Smith Hall': { lat: 42.449199, lng: -76.483547 },
  'Klarman Hall': { lat: 42.4491, lng: -76.4831 },
  'McGraw Hall': { lat: 42.447983, lng: -76.484332 }, 
  'White Hall': { lat: 42.448500, lng: -76.484500 }, 
  'Lincoln Hall': { lat: 42.4502, lng: -76.4835 }, 
  
  // Ag Quad            
  'Mann Library': { lat: 42.448772, lng: -76.476401 },
  'Morrison Hall': { lat: 42.447566, lng: -76.469287 },          
  'Warren Hall': { lat: 42.449080, lng: -76.477100 },          
  'Plant Science Building': { lat: 42.448358, lng: -76.477259 },
  'Caldwell Hall': { lat: 42.448978, lng: -76.478630 },     
  'Computing and Communications Center': { lat: 42.449256, lng: -76.479155 }, 
  'Kennedy Hall': { lat: 42.448900, lng: -76.479900 },     
  'Roberts Hall': { lat: 42.448800, lng: -76.480300 },
  'Malott Hall': { lat: 42.4482, lng: -76.4802},
  'Martha Van Rensselaer Hall': { lat: 42.4499, lng: -76.4787},
  
  // Central Campus
  'Statler Hall': { lat: 42.445577, lng: -76.482132 },
  'Bailey Hall': { lat: 42.4492, lng: -76.479156 }, 
  'Day Hall': { lat: 42.447000, lng: -76.483 }, 
  'Sage Hall': { lat: 42.446981, lng: -76.482837 },
  'Sage Chapel': { lat: 42.4472, lng: -76.4844},
  'Olin Library': { lat: 42.447184, lng: -76.484665 },
  'Willard Straight Hall': { lat: 42.446947, lng: -76.485168 },
  'Uris Hall': { lat: 42.447379, lng: -76.483663 },
  'Uris Library': { lat: 42.447783, lng: -76.484371 },
  'Physical Sciences Building': { lat: 42.4499, lng: -76.4817},
  'Anabel Taylor Hall': { lat: 42.4449, lng: -76.4858},
  'Barton Hall': { lat: 42.4460, lng: -76.4807},
  'Comstock Hall': { lat: 42.4466, lng: -76.4794},
  'Ives Hall': { lat: 42.4473, lng: -76.4806},
  'The Cornell Store': { lat: 42.4469, lng: -76.4844},

  
  // North Campus
  'Toni Morrison Hall': { lat: 42.455820, lng: -76.479060 },
  'Appel Commons': { lat: 42.452807, lng: -76.477156 },            
  'Robert Purcell Community Center (RPCC)': { lat: 42.456000, lng: -76.478207 },  
  'Clara Dickson Hall': { lat: 42.455172, lng: -76.478821 },       
  'Balch Hall': { lat: 42.456369, lng: -76.477603 },               
  'Court-Kay-Bauer Community': { lat: 42.454900, lng: -76.479500 }, 
  'Mews Hall': { lat: 42.454000, lng: -76.478941 },                 
  'Hasbrouck Apartments': { lat: 42.454500, lng: -76.476800 },     
  'Fuertes Observatory': { lat: 42.455500, lng: -76.477200 },
  'Risley Hall': { lat: 42.4531, lng: -76.4818},
  
  // West Campus
  'Baker Tower': { lat: 42.447000, lng: -76.485000 },
  'Founders Hall': { lat: 42.446000, lng: -76.487000 }, 
  'Carl Becker House': { lat: 42.4482, lng: -76.4895 },
  'Flora Rose House': { lat: 42.4479, lng: -76.4888},
  'Hans Bethe House': { lat: 42.4470, lng: -76.4886},
  'William Keeton House': { lat: 42.4466, lng: -76.4894},

  // Collegetown
  'Schwartz Center': { lat: 42.442000, lng: -76.485000 },
  'Sheldon Court': { lat: 42.4422, lng: -76.4856},
  
  // Gyms
  'Teagle Hall': { lat: 42.444817, lng: -76.479973 },
  'Noyes Community Recreation Center': { lat: 42.446567, lng: -76.488040 },
  'Helen Newman Hall': { lat: 42.454440, lng: -76.478819 },
  'Toni Morrison Gym': { lat: 42.455820, lng: -76.479060 },
};

// Helper function to get all location data
export function getAllLocations(): Record<string, Coordinates> {
  const allLocations: Record<string, Coordinates> = { ...campusBuildings };
  
  // Add gym locations to the combined object
  gymLocations.forEach(gym => {
    allLocations[gym.name] = gym.coordinates;
    // Also add alternate names
    gym.alternateNames?.forEach(altName => {
      allLocations[altName] = gym.coordinates;
    });
  });
  
  return allLocations;
}

// Function to find coordinates by partial name match
export function findLocationCoordinates(locationName: string): Coordinates | null {
  const allLocations = getAllLocations();
  
  // First try exact match
  if (allLocations[locationName]) {
    return allLocations[locationName];
  }
  
  // Then try case-insensitive match
  const lowerLocationName = locationName.toLowerCase();
  for (const [name, coords] of Object.entries(allLocations)) {
    if (name.toLowerCase() === lowerLocationName) {
      return coords;
    }
  }
  
  // Finally try partial match
  for (const [name, coords] of Object.entries(allLocations)) {
    if (name.toLowerCase().includes(lowerLocationName) || 
        lowerLocationName.includes(name.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

export default {
  gymLocations,
  campusBuildings,
  getAllLocations,
  findLocationCoordinates
};