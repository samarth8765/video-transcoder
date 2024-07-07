import axios from "axios";
import { ChangeEvent, useState } from "react";
import { ProgressBar } from "./Progressbar";

export const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [disableUploadButton, setDisableUploadButton] = useState<boolean>(true);
  const [progressBarSpeed, setProgressBarSpeed] = useState<number>(0);
  const [progressBarProgress, setProgressBarProgress] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadMessage("");
    setFiles(e.target.files);
    setDisableUploadButton(false);
    setProgressBarProgress(0);
    setProgressBarSpeed(0);
  };

  const handleUpload = async () => {
    console.log("Button Clicked");
    if (!files) {
      return;
    }

    setUploadMessage("Get presigned link from backend...");
    setDisableUploadButton(true);

    const uploadFile = async (file: File) => {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          fileName: file.name,
          fileType: file.type,
        });

        const { url } = response.data;

        setUploadMessage("Uploading...");

        await axios.put(url, file, {
          headers: {
            "Content-type": file.type,
          },
          onUploadProgress(progressEvent) {
            if (progressEvent.rate && progressEvent.total) {
              const speed = parseFloat(
                (progressEvent.rate / 1000000).toFixed(3)
              );

              const progress = parseFloat(
                (progressEvent.loaded / progressEvent.total).toFixed(2)
              );

              setProgressBarSpeed(speed);
              setProgressBarProgress(progress);
            }
          },
        });
        setUploadMessage("Files Uploaded Successfully");
        setProgressBarProgress(1);
      } catch (err) {
        console.log(err);
        setUploadMessage(`Error uploading file ${file.name}`);
      } finally {
        setFiles(null);
      }
    };

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-10">
        <input type="file" onChange={handleChange} className="" />
        <button
          onClick={handleUpload}
          className="border border-black rounded bg-red-400 p-3 font-semibold mt-4"
          disabled={disableUploadButton}
        >
          Click Here To Upload
        </button>
        <div>{uploadMessage && <div>{uploadMessage}</div>}</div>
        <div>
          {
            <ProgressBar
              progress={progressBarProgress}
              speed={progressBarSpeed}
            />
          }
        </div>
      </div>
    </div>
  );
};
