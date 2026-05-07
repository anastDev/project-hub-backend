import dotenv from "dotenv";
import {
  filterByUserLocation,
  filterDeviationsByLocation,
} from "../utils/geoFilter";
import { RoadConditions } from "../models/condition.model";
import { DeviationConditions } from "../models/deviation.model";

dotenv.config();

const TRAFIKVERKET_URL = process.env.TRAFIKVERKET_URL || "";
const TRAFIKVERKET_KEY = process.env.TRAFIKVERKET_KEY || "";

export const getRoadConditions = async (
  countyNo: number,
  lat: number,
  long: number,
) => {
  try {
    const xmlBody = `
    <REQUEST>
      <LOGIN authenticationkey="${TRAFIKVERKET_KEY}" />
      <QUERY objecttype="RoadCondition" schemaversion="1.2">
        <FILTER>
          <EQ name="CountyNo" value="${countyNo}"/>
        </FILTER>
        <INCLUDE>ConditionText</INCLUDE>
        <INCLUDE>ConditionInfo</INCLUDE>
        <INCLUDE>SafetyRelatedMessage</INCLUDE>
        <INCLUDE>RoadNumber</INCLUDE>
        <INCLUDE>CountyNo</INCLUDE>
        <INCLUDE>LocationText</INCLUDE>
        <INCLUDE>Geometry</INCLUDE>
        <INCLUDE>StartTime</INCLUDE>
        <INCLUDE>EndTime</INCLUDE>
      </QUERY>
    </REQUEST>
  `;

    const response = await fetch(TRAFIKVERKET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xmlBody,
    });

    const data = await response.json();

      if (data.status === 404) {
        return null as unknown as RoadConditions[];
      }

    if (!data.ok) {
      throw new Error(`Failed to fetch road conditions: ${data.status}`);
    }

    const allConditions = data.RESPONSE.RESULT[0].RoadCondition;
    return filterByUserLocation(allConditions, long, lat);
  } catch (err) {
    console.error("Error fetching road conditions: ", err);
    throw err;
  }
};

export const getAccidents = async (
  countyNo: number,
  lat: number,
  long: number,
) => {
  try {
    const xmlBody = `
    <REQUEST>
      <LOGIN authenticationkey="${TRAFIKVERKET_KEY}" />
      <QUERY objecttype="Situation" namespace="road.trafficinfo" schemaversion="1.6" limit="10">
        <FILTER>
          <EQ name="Deviation.CountyNo" value="${countyNo}"/>
        </FILTER>
        <INCLUDE>Deviation.AffectedDirection</INCLUDE>
        <INCLUDE>Deviation.CountyNo</INCLUDE>
        <INCLUDE>Deviation.Geometry</INCLUDE>
        <INCLUDE>Deviation.Header</INCLUDE>
        <INCLUDE>Deviation.IconId</INCLUDE>
        <INCLUDE>Deviation.Message</INCLUDE>
        <INCLUDE>Deviation.MessageType</INCLUDE>
        <INCLUDE>Deviation.MessageTypeValue</INCLUDE>
        <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
        <INCLUDE>Deviation.NumberOfLanesRestricted</INCLUDE>
        <INCLUDE>Deviation.RoadNumber</INCLUDE>
        <INCLUDE>Deviation.RoadName</INCLUDE>
        <INCLUDE>Deviation.StartTime</INCLUDE>
        <INCLUDE>Deviation.SeverityText</INCLUDE>
        <INCLUDE>Deviation.Suspended</INCLUDE>
        <INCLUDE>Deviation.TrafficRestrictionType</INCLUDE>
        <INCLUDE>Deviation.PositionalDescription</INCLUDE>
      </QUERY>
    </REQUEST>
  `;

    const response = await fetch(TRAFIKVERKET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xmlBody,
    });

    const data = await response.json();

    if (data.status === 404) {
      return null as unknown as DeviationConditions[];
    }

    const allConditions = data.RESPONSE.RESULT[0].Situation;
    const allDeviations = allConditions.flatMap(
      (situation: any) => situation.Deviation,
    );

    return filterDeviationsByLocation(allDeviations, long, lat);
  } catch (err) {
    console.error("Error fetching accidents: ", err);
    throw err;
  }
};
