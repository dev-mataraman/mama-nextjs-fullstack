"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";

const inputResolution = {
	width: 1280, // Standard 720p width
	height: 1000, // Standard 720p height
};

const videoConstraints = {
	width: inputResolution.width,
	height: inputResolution.height,
	facingMode: "user",
	aspectRatio: inputResolution.width / inputResolution.height,
};

function ScreenMain() {
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [loaded, setLoaded] = useState(false);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Handle window resize
	useEffect(() => {
		const updateDimensions = () => {
			const containerWidth = window.innerWidth;
			const containerHeight = window.innerHeight;
			const aspectRatio = inputResolution.width / inputResolution.height;

			let width = containerWidth;
			let height = width / aspectRatio;

			if (height > containerHeight) {
				height = containerHeight;
				width = height * aspectRatio;
			}

			setDimensions({ width, height });
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const handleVideoLoad = (
		videoNode: React.SyntheticEvent<HTMLVideoElement>,
	) => {
		const video = videoNode.target as HTMLVideoElement;
		if (video.readyState !== 4) return;
		if (loaded) return;

		if (canvasRef.current && webcamRef.current?.video) {
			runDetector(webcamRef.current.video, canvasRef.current);
		}
		setLoaded(true);
	};

	return (
		<div className="relative w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
			<div
				className="relative"
				style={{
					width: dimensions.width,
					height: dimensions.height,
				}}
			>
				<Webcam
					ref={webcamRef}
					width={inputResolution.width}
					height={inputResolution.height}
					videoConstraints={videoConstraints}
					onLoadedData={handleVideoLoad}
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<canvas
					ref={canvasRef}
					width={inputResolution.width}
					height={inputResolution.height}
					className="absolute inset-0 w-full h-full object-cover z-20"
				/>
			</div>

			{!loaded && (
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
					Loading...
				</div>
			)}
		</div>
	);
}

export default ScreenMain;
