export interface DeviationConditions {
    AffectedDirection?: string;
    CountyNo?: number[];
    Geometry?: { WGS84: string }
    Header?: string
    IconId?: string
    Message?: string
    MessageType?: string
    MessageTypeValue?: string
    LocationDescriptor?: string
    NumberOfLanesRestricted?: number
    RoadNumber?: string
    RoadName?: string
    StartTime?: string
    SeverityText?: string
    Suspended?: boolean
    TrafficRestrictionType?: string
    PositionalDescription?: string
}