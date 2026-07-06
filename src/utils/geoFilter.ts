import { point, lineString, pointToLineDistance, distance } from '@turf/turf';
import wellknown from 'wellknown';

export const filterByUserLocation = (conditions: any[], long: number, lat: number,) => {
  const userPoint = point([long, lat]);

  return conditions.filter((record) => {
    const geometry = record.Geometry?.WGS84;
    if(!geometry) {
       return false;
    }

    let geoJSON = wellknown.parse(geometry);
    if(!geoJSON) return false;

    const line = lineString((geoJSON as any).coordinates);
    const distance = pointToLineDistance(userPoint, line, {units: "kilometers"});

    geoJSON = null;

    return distance <= 1;
  })
}


export const filterDeviationsByLocation = (deviations: any[], long: number, lat: number) => {
  const userPoint = point([long, lat]);

  return deviations.filter((record) => {
    const geometry = record.Geometry?.WGS84;
    if (!geometry) return false;

    let geoJSON = wellknown.parse(geometry);
    if (!geoJSON) return false;

    const deviationPoint = point((geoJSON as any).coordinates);
    const usersDistance = distance(userPoint, deviationPoint, { units: "kilometers" });

    geoJSON = null;

    return usersDistance <= 8;
  });
};