const CITY_TO_COUNTY: Record<string, number> = {
 "stockholm": 1,
  "uppsala": 3, 
  "södermanland": 4,
  "sodermanland": 4, 
  "östergötland": 5,
  "ostergotland": 5, 
  "jönköping": 6,
  "jonkoping": 6, 
  "kronoberg": 7,
  "kalmar": 8,
  "gotland": 9,
  "blekinge": 10,
  "skåne": 12,
  "skane": 12, 
  "halland": 13, 
  "västra götaland": 14,
  "vastra gotaland": 14, 
  "värmland": 17,
  "varmland": 17, 
  "örebro": 18,
  "orebro": 18, 
  "västmanland": 19,
  "vastmanland": 19, 
  "dalarna": 20,
  "gävleborg": 21,
  "gavleborg": 21, 
  "västernorrland": 22,
  "vasternorrland": 22, 
  "jämtland": 23,
  "jamtland": 23, 
  "västerbotten": 24,
  "vasterbotten": 24, 
  "norrbotten": 25,
  "göteborg": 14,
  "goteborg": 14,
  "malmö": 12, 
  "malmo": 12,
  "helsingborg": 12, 
  "lund": 12,       
  "umeå": 24,       
  "umea": 24,
};

export function getCountyByCity(city: string): number | null {
  if(!city) return null;
  return CITY_TO_COUNTY[city.trim().toLowerCase()] ?? null;
}

export function getAllCities(): string[] {
  return Object.keys(CITY_TO_COUNTY).sort();
}