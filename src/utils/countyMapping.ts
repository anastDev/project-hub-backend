const CITY_TO_COUNTY: Record<string, number> = {
    "stockholm": 1,

    "uppsala": 3,

    "södermanland": 4,
    "sodermanland": 4,
    "sudermannia": 4,

    "östergötland": 5,
    "ostergotland": 5,
    "east gothland": 5,
    "east gotland": 5,

    "jönköping": 6,
    "jonkoping": 6,

    "kronoberg": 7,

    "kalmar": 8,

    "gotland": 9,
    "gotland island": 9,

    "blekinge": 10,

    "skåne": 12,
    "skane": 12,
    "scania": 12,
  
    "malmö": 12,
    "malmo": 12,
    "helsingborg": 12,
    "lund": 12,
    "kristianstad": 12,
    "landskrona": 12,


    "halland": 13,

    "halmstad": 13,
    "varberg": 13,

  
    "västra götaland": 14,
    "vastra gotaland": 14,
    "west gothland": 14,
    "west götaland": 14,
    
    "göteborg": 14,
    "goteborg": 14,
    "gothenburg": 14,  
    "borås": 14,
    "boras": 14,
    "skövde": 14,
    "skovde": 14,

    "värmland": 17,
    "varmland": 17,
    "vermland": 17,

    "karlstad": 17,

    "örebro": 18,
    "orebro": 18,

    "västmanland": 19,
    "vastmanland": 19,
    "westmanland": 19,
    "västerås": 19,
    "vasteras": 19,

    "dalarna": 20,
    "dalecarlia": 20,

    "falun": 20,

  
    "gävleborg": 21,
    "gavleborg": 21,
    "gävle": 21,
    "gavle": 21,

    "västernorrland": 22,
    "vasternorrland": 22,
    "westernorrland": 22,
    "sundsvall": 22,

    "jämtland": 23,
    "jamtland": 23,
    // Major city
    "östersund": 23,
    "ostersund": 23,

    "västerbotten": 24,
    "vasterbotten": 24,
    "westerbotten": 24,

    "umeå": 24,
    "umea": 24,
    "skellefteå": 24,
    "skelleftea": 24,

    "norrbotten": 25,
    "northbotten": 25,
    
    "luleå": 25,
    "lulea": 25,
    "kiruna": 25,
};

export function getCountyByCity(city: string): number | null {
  if(!city) return null;
  return CITY_TO_COUNTY[city.trim().toLowerCase()] ?? null;
}

export function getAllCities(): string[] {
  return Object.keys(CITY_TO_COUNTY).sort();
}