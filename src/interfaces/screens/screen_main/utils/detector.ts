import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";
export const runDetector = async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: "tfjs" as const,
        refineLandmarks: true,
    };
    const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
    );
    const detect = async (net: faceLandmarksDetection.FaceLandmarksDetector) => {
        const estimationConfig = { flipHorizontal: false };
        const faces = await net.estimateFaces(video, estimationConfig);
        const ctx = canvas.getContext("2d");
        if (ctx) {
            requestAnimationFrame(() => drawMesh(faces[0], ctx));
        }
        detect(detector);
    };
    detect(detector);
};