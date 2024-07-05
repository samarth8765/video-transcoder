import axios from "axios";
import { ChangeEvent, useState } from "react";

export const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files) {
      return;
    }

    const uploadFile = async (file: File) => {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
          fileName: file.name,
          fileType: file.type,
        });

        const { url } = response.data;

        await axios.put(url, file, {
          headers: {
            "Content-type": file.type,
          },
        });
        setUploadMessage("Files Uploaded Successfully");
      } catch (err) {
        console.log(err);
        setUploadMessage(`Error uploading file ${file.name}`);
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
        >
          Click Here To Upload
        </button>
        <div>{uploadMessage && <div>{uploadMessage}</div>}</div>
      </div>
    </div>
  );
};
