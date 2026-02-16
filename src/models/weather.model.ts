export interface WeatherApiResponse {
    coord: {
        lon: number;
        lat: number;
    },
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    rain?: {
        "1h": number;
    },
    snow?: {
        "1h": number;
    }
    clouds: {
        all: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    name: string;
    cod: number;
}

export default WeatherApiResponse;