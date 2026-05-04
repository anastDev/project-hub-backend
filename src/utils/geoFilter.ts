import * as turf from "@turf/turf";
import * as wellknown from "wellknown";

export const filterByUserLocation = (conditions: any[], long: number, lat: number,) => {
  const userPoint = turf.point([long, lat]);

  // console.log("Total conditions received:", conditions.length)

  return conditions.filter((record) => {
    const geometry = record.Geometry?.WGS84;
    if(!geometry) {
      //  console.log("No geometry for record:", record.RoadNumber)
       return false;
    }

    const geoJSON = wellknown.parse(geometry);
    if(!geoJSON) return false;

    const line = turf.lineString((geoJSON as any).coordinates);
    const distance = turf.pointToLineDistance(userPoint, line, {units: "kilometers"});

    // console.log(`${record.RoadNumber} - distance: ${distance}km`)

    return distance <= 1;
  })
}


export const filterDeviationsByLocation = (deviations: any[], long: number, lat: number) => {
  const userPoint = turf.point([long, lat]);

  return deviations.filter((record) => {
    const geometry = record.Geometry?.WGS84;
    if (!geometry) return false;

    const geoJSON = wellknown.parse(geometry);
    if (!geoJSON) return false;

    const point = turf.point((geoJSON as any).coordinates);
    const distance = turf.distance(userPoint, point, { units: "kilometers" });

    return distance <= 8;
  });
};