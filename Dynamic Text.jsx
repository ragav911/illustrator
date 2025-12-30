// Dynamic Text - Resize selected point text objects to same width and align center
// Works in Adobe Illustrator

if (app.documents.length === 0) {
    alert("Please open a document and select some point text objects.");
    exit();
} else if (app.activeDocument.selection.length === 0) {
    alert("Please select some point text objects to resize.");
    exit();
} else {
    var doc = app.activeDocument;
    var selection = doc.selection;

    // Ask user for target width and unit
    var input = prompt("Enter desired text width (e.g. 200 px, 50 mm, 3 in):", "200 px");

    if (!input) {
        // Cancelled
        exit();
    }

    var match = input.match(/^([\d.]+)\s*(px|mm|cm|in)?$/i);

    if (!match) {
        alert("Invalid input. Use format like: 200 px, 50 mm, 3 in");
        exit();
    }

    var value = parseFloat(match[1]);
    var unit = (match[2] || "px").toLowerCase();
    var targetWidth = value;

    // Convert unit to points
    var unitToPoints = {
        px: 0.75,     // 1 px = 0.75 pt
        mm: 2.83465,
        cm: 28.3465,
        "in": 72
    };

    if (!(unit in unitToPoints)) {
        alert("Unsupported unit. Use px, mm, cm, or in.");
        exit();
    }

    targetWidth = targetWidth * unitToPoints[unit];

    // Filter selection to only pointText objects
    var textItems = [];

    for (var i = 0; i < selection.length; i++) {
        if (selection[i].typename === "TextFrame" && selection[i].kind === TextType.POINTTEXT) {
            textItems.push(selection[i]);
        }
    }

    if (textItems.length === 0) {
        alert("No point text objects found in the selection.");
        exit();
    }

    // Resize text widths
    for (var j = 0; j < textItems.length; j++) {
        var item = textItems[j];
        var currentWidth = item.width;

        if (currentWidth === 0) continue;

        var scaleFactor = targetWidth / currentWidth * 100;
        item.resize(scaleFactor, scaleFactor);
    }

    // Align all items to center of selection bounds
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;

    for (var k = 0; k < textItems.length; k++) {
        var bounds = textItems[k].geometricBounds;
        minX = Math.min(minX, bounds[0]);
        maxX = Math.max(maxX, bounds[2]);
    }

    var centerX = (minX + maxX) / 2;

    for (var l = 0; l < textItems.length; l++) {
        var item = textItems[l];
        var itemWidth = item.width;
        item.left = centerX - (itemWidth / 2);
    }

    alert("All text resized and aligned. You can now space manually.");
}
