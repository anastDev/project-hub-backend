import dotenv from "dotenv";

dotenv.config();

const TRAFIKVERKET_URL = process.env.TRAFIKVERKET_URL || "";
const TRAFIKVERKET_KEY = process.env.TRAFIKVERKET_KEY || "";

export const getRoadConditions = async(countyNo: number) => {
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

  return data.RESPONSE.RESULT[0].RoadCondition;
  } catch (err) {
    console.error("Error fetching road conditions: ", err);
    throw err;
  }
}