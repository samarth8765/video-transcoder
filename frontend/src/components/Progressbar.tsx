import React from "react";
import Bar from "@ramonak/react-progress-bar";

interface ProgressBarProps {
  speed: number;
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { speed, progress } = props;
  return (
    <div className="w-screen">
      <div className="text-center mt-3">Speed: {speed.toFixed(2)} MB/s</div>
      <div className="text-center mt-3 mb-3">
        Progress: {(progress * 100).toFixed(2)} %
      </div>

      <Bar
        completed={(progress * 100).toFixed(2)}
        maxCompleted={100}
        width="100%"
        className="ml-16 mr-16"
      />
    </div>
  );
};
