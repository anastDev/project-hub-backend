export interface RoadConditions {
    RoadNumber: string;
    LocationText: string;
    ConditionText: string;
    ConditionInfo: string;
    Geometry?: { WGS84: string };
}