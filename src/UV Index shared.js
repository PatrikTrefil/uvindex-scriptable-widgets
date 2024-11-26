// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;

const { weatherApiAppId } = importModule("secrets");

async function getLocation() {
  const locationFile = FileManager.local().joinPath(
    FileManager.local().temporaryDirectory(),
    "location.txt"
  );
  let location;

  try {
    location = await Location.current();
  } catch (error) {
    location = null;
    console.error("Error retrieving location:", error);
  }

  // Fallback to stored location data if current location retrieval fails
  if (!location) {
    let storedLocationData;
    try {
      storedLocationData = FileManager.local().readString(locationFile);
    } catch (error) {
      console.error("Error reading stored location data:", error);
      throw new Error("Error reading stored location data:", error);
    }

    if (storedLocationData) {
      location = JSON.parse(storedLocationData);
      console.log("Using stored location data as a fallback:", location);
      return location;
    } else {
      throw new Error("No location data was stored");
    }
  } else {
    // Update stored location data with the current location (if retrieved)
    FileManager.local().writeString(locationFile, JSON.stringify(location));

    return location;
  }
}

async function getUvIndexDataFromApi(location) {
  const { latitude: lat, longitude: lon } = location;

  const uvIndexRequest = new Request(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appId=${weatherApiAppId}`
  );
  const uvIndexResponse = await uvIndexRequest.loadJSON();

  const currentUVIndex = uvIndexResponse.current.uvi.toFixed(1);
  const todayMaxUVIndex = uvIndexResponse.daily[0].uvi.toFixed(1);
  const tomorrowMaxUVIndex = uvIndexResponse.daily[1].uvi.toFixed(1);
  const todayMaxUVIndexTime = new Date(
    uvIndexResponse.daily[0].dt * 1000
  ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const tomorrowMaxUVIndexTime = new Date(
    uvIndexResponse.daily[1].dt * 1000
  ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return {
    currentUVIndex,
    today: {
      maxUvIndex: todayMaxUVIndex,
      maxUvIndexTime: todayMaxUVIndexTime,
    },
    tomorrow: {
      maxUvIndex: tomorrowMaxUVIndex,
      maxUvIndexTime: tomorrowMaxUVIndexTime,
    },
  };
}

async function getUvIndexDataForCurrentLocation() {
  let location;
  try {
    location = await getLocation();
  } catch {
    location = null;
  }

  let uvIndexData;
  if (location) {
    try {
      uvIndexData = await getUvIndexDataFromApi(location);
    } catch {
      uvIndexData = null;
    }
  } else {
    uvIndexData = null;
  }
  return { uvIndexData, location };
}

module.exports = {
  getUvIndexDataFromApi,
  getLocation,
  getUvIndexDataForCurrentLocation,
};
