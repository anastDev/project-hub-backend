const parseMsDate = (dateStr: string | undefined): string | undefined => {
    if (!dateStr) return undefined
    const match = dateStr.match(/\/Date\((\d+)([+-]\d+)?\)\//)
    if (!match || !match[1]) return dateStr
    return new Date(parseInt(match[1], 10)).toISOString()
}

export const normalizeGothenburgDeviation = (item: any) => ({
    Header: item.Deviation.Header,
    Message: item.Deviation.Message,
    MessageType: item.Deviation.MessageType,
    MessageTypeValue: item.Deviation.MessageTypeValue,
    SeverityText: item.Deviation.SeverityText,
    LocationDescriptor: item.Deviation.LocationDescriptor,
    TrafficRestrictionType: item.Deviation.TrafficRestrictionType,
    StartTime: parseMsDate(item.Deviation.StartTime),
    EndTime: parseMsDate(item.Deviation.EndTime),
    Geometry: {
        WGS84: item.Deviation.Geometry?.WGS84
    },
    RoadNumber: undefined,
    RoadName: undefined,
    IconId: undefined,
    Suspended: undefined,
})