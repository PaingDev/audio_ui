import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

// Import the necessary Web Audio API constructors
import { AudioContext } from "standardized-audio-context";

const WaveformSpectrogram = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Load the audio file
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Decode the audio data
        return new Promise((resolve, reject) => {
          const audioContext = new AudioContext();
          audioContext.decodeAudioData(
            arrayBuffer,
            (audioBuffer) => resolve(audioBuffer),
            (error) => reject(error)
          );
        });
      })
      .then((audioBuffer) => {
        // Draw the waveform chart
        const waveformData = audioBuffer.getChannelData(0);
        const waveformChart = new Chart(context, {
          type: "line",
          data: {
            labels: waveformData.map((_, index) => index),
            datasets: [
              {
                data: waveformData,
                borderColor: "blue",
                borderWidth: 1,
              },
            ],
          },
        });

        // Draw the spectrogram chart
        const audioBufferSource = audioContext.createBufferSource();
        audioBufferSource.buffer = audioBuffer;
        const analyser = audioContext.createAnalyser();
        audioBufferSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 2048;
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        const spectrogramChart = new Chart(context, {
          type: "heatmap",
          data: {
            labels: frequencyData.map((_, index) =>
              index * (audioBuffer.duration / analyser.frequencyBinCount)
            ),
            datasets: [
              {
                data: frequencyData,
                borderWidth: 1,
                min: 0,
                max: 255,
                color: (context) => {
                  const value = context.dataset.data[context.dataIndex];
                  return `rgba(255, 0, 0, ${value / 255})`;
                },
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time (s)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Frequency (Hz)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });

        const updateCharts = () => {
          // Update the waveform chart
          waveformChart.update();

          // Update the spectrogram chart
          analyser.getByteFrequencyData(frequencyData);
          spectrogramChart.update();

          requestAnimationFrame(updateCharts);
        };

        requestAnimationFrame(updateCharts);

        // Play the audio file
        audioBufferSource.start();
      });
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default WaveformSpectrogram;
