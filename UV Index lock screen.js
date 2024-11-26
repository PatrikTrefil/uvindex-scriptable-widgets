// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: sun;

const { getUvIndexDataForCurrentLocation } = importModule("UV Index shared");

function createWidget(uvIndexData) {
  const widget = new ListWidget();
  // stack direction is horizontal by default
  // this stack is used for "Max *" heading
  const headingStack = widget.addStack();
  headingStack.centerAlignContent(); // align-items: center
  headingStack.addSpacer(null); // margin-left: auto

  const titleText = headingStack.addText("Max");
  titleText.font = Font.boldSystemFont(11);
  titleText.textColor = Color.white();
  titleText.centerAlignText();

  headingStack.addSpacer(3);

  const sunIcon = headingStack.addImage(SFSymbol.named("sun.max.fill").image);
  sunIcon.imageSize = new Size(15, 15);

  headingStack.addSpacer(null); // margin-right: auto

  // Add max UV index for today
  const maxUVIndexText = widget.addText(uvIndexData?.today?.maxUvIndex ?? "-");
  maxUVIndexText.font = Font.boldSystemFont(20);
  maxUVIndexText.textColor = Color.white();
  maxUVIndexText.centerAlignText();

  return widget;
}

async function main() {
  const { uvIndexData } = await getUvIndexDataForCurrentLocation();

  const widget = createWidget(uvIndexData);

  if (config.runsInAccessoryWidget) Script.setWidget(widget);
  else widget.presentSmall();

  Script.complete();
}

main();
