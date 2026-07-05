import * as turf from "@turf/turf";

export function getCurvedFlightPath(from: [number, number], to: [number, number]) {
  const start = turf.point(from);
  const end = turf.point(to);
  
  // Generuje serię 100 punktów tworzących łuk na kuli ziemskiej
  const arc = turf.greatCircle(start, end, { npoints: 100 });
  return arc; 
}