let capture;

function setup() {
    var canvas = createCanvas(100, 100);
    canvas.parent('profile-canvas');
    // Create the video capture and hide the element.
    capture = createCapture(VIDEO);
    capture.hide();
}

function draw() {
    // Draw the video capture within the canvas.
    image(capture, 0, 0, width, width * capture.height / capture.width);

    // Invert the colors in the stream.
    filter(INVERT);
}