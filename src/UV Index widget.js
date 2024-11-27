// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: sun;

const { getUvIndexDataForCurrentLocation } = importModule("UV Index shared");

function createWidget(uvIndexData) {
  const widget = new ListWidget();
  widget.setPadding(8, 16, 16, 0);

  const titleText = widget.addText("UV Index️");
  titleText.font = Font.boldSystemFont(16);
  titleText.textColor = Color.black();

  widget.addSpacer(0);

  // Add current UV index
  const currentUVIndexText = widget.addText(uvIndexData.currentUVIndex ?? "-");
  currentUVIndexText.font = Font.systemFont(36);
  currentUVIndexText.textColor = Color.black();

  widget.addSpacer(30);

  // Add maximum UV index for today or tomorrow
  let maxUVIndexText;
  let maxUVIndexTimeText;
  const now = new Date();
  if (now.getHours() >= 20) {
    maxUVIndexText = widget.addText(
      `Tmrw's Max: ${uvIndexData?.tomorrow?.maxUvIndex ?? "-"}`
    );
    maxUVIndexTimeText = widget.addText(
      `(around ${uvIndexData?.tomorrow?.maxUvIndexTime ?? "-"})`
    );
  } else {
    maxUVIndexText = widget.addText(
      `Today's Max: ${uvIndexData?.today?.maxUvIndex ?? "-"}`
    );
    maxUVIndexTimeText = widget.addText(
      `(around ${uvIndexData?.today?.maxUvIndexTime ?? "-"})`
    );
  }
  maxUVIndexText.font = Font.systemFont(14);
  maxUVIndexText.textColor = Color.black();
  maxUVIndexTimeText.font = Font.systemFont(12);
  maxUVIndexTimeText.textColor = Color.black();

  widget.backgroundColor = new Color("#ffa700");

  return widget;
}

async function main() {
  const { uvIndexData } = await getUvIndexDataForCurrentLocation();

  const widget = createWidget(uvIndexData);

  if (config.runsInWidget) {
    // Display widget in the widget area
    Script.setWidget(widget);
  } else {
    // Display widget in the app
    widget.presentMedium();
  }

  Script.complete();
}

main();
