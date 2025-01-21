import { TRIANGULATION } from "./triangulation";
import type { Keypoint } from "@tensorflow-models/face-landmarks-detection";

interface Prediction {
    keypoints: Keypoint[];
}

// Indeks untuk area mata dalam TRIANGULATION
const LEFT_EYE_INDICES = [
    33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
];
const RIGHT_EYE_INDICES = [
    362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398,
];

const LIP_INDICES = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185,
];


export const drawMesh = (prediction: Prediction, ctx: CanvasRenderingContext2D) => {
    if (!prediction) return;
    const keyPoints = prediction.keypoints;
    if (!keyPoints) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Gambar area mata dengan border tebal
    drawHighlightedArea(ctx, keyPoints, LEFT_EYE_INDICES, "red");
    drawHighlightedArea(ctx, keyPoints, RIGHT_EYE_INDICES, "red");

    // Gambar area bibir atas dan bawah
    drawHighlightedArea(ctx, keyPoints, LIP_INDICES, "green");


    // Gambar mesh biasa
    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        const points = [
            TRIANGULATION[i * 3],
            TRIANGULATION[i * 3 + 1],
            TRIANGULATION[i * 3 + 2],
        ].map((index) => keyPoints[index]);
        drawPath(ctx, points, true, "#404040");
    }

    // Gambar titik-titik keypoints
    for (const keyPoint of keyPoints) {
        ctx.beginPath();
        ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }
};

const drawPath = (
    ctx: CanvasRenderingContext2D,
    points: Keypoint[],
    closePath: boolean,
    strokeStyle: string
) => {
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point.x, point.y);
    }
    if (closePath) region.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.stroke(region);
};

const drawHighlightedArea = (
    ctx: CanvasRenderingContext2D,
    keyPoints: Keypoint[],
    indices: number[],
    color: string
) => {
    const points = indices.map((index) => keyPoints[index]);
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        region.lineTo(points[i].x, points[i].y);
    }
    region.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3; // Border tebal
    ctx.stroke(region);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2; // Transparansi isi area
    ctx.fill(region);
    ctx.globalAlpha = 1; // Reset transparansi
};