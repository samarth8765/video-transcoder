import axios from "axios";
import { ChangeEvent, useState } from "react";
import { ProgressBar } from "./Progressbar";
// import { Button } from "@/components/ui/button";

export const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesUploaded, setFilesUploaded] = useState<boolean[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [disableUploadButton, setDisableUploadButton] = useState<boolean>(true);
  const [progressBarSpeed, setProgressBarSpeed] = useState<number>(0);
  const [progressBarProgress, setProgressBarProgress] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadMessage("");
    setFiles(e.target.files);
    setFilesUploaded(Array.from(e.target.files || []).map(() => false));
    setDisableUploadButton(false);
    setProgressBarProgress(0);
    setProgressBarSpeed(0);
  };

  const handleUpload = async () => {
    if (!files) {
      return;
    }

    setUploadMessage("Get presigned link from backend...");
    setDisableUploadButton(true);

    const totalFileSize = Array.from(files).reduce(
      (acc, file) => acc + file.size,
      0
    );
    let currentFileSize = 0;

    const uploadFile = async (file: File, index: number) => {
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
            if (progressEvent.rate) {
              const speed = parseFloat(
                (progressEvent.rate / 1000000).toFixed(3)
              );

              currentFileSize += progressEvent.bytes;

              const progress = parseFloat(
                (currentFileSize / totalFileSize).toFixed(2)
              );

              setProgressBarSpeed(speed);
              setProgressBarProgress(progress);
            }
          },
        });

        setFilesUploaded((prevFilesUploaded) => {
          const newFilesUploaded = [...prevFilesUploaded];
          newFilesUploaded[index] = true;
          return newFilesUploaded;
        });
      } catch (err) {
        console.log(err);
        setUploadMessage(`Error uploading file ${file.name}`);
        return;
      }
    };

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], i);
    }

    setUploadMessage("Files Uploaded Successfully");
    setProgressBarProgress(1);
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-10">
        <input type="file" onChange={handleChange} className="" multiple />
        <div className="mt-10">
          {files && (
            <div>
              <table className="border border-black">
                <thead className="border border-black rounded">
                  <tr>
                    <th className="text-center p-2">Name</th>
                    <th className="text-center">Size(MB)</th>
                    <th className="text-center">Type</th>
                    <th className="text-center p-2">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(files).map((file: File, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-3 border border-black">{file.name}</td>
                        <td className="p-3 border border-black">
                          {(file.size / 1000000).toFixed(2)} MB
                        </td>
                        <td className="p-3 border border-black">{file.type}</td>
                        <td className="p-3 border border-black">
                          {filesUploaded[index] ? "✅" : "❌"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
