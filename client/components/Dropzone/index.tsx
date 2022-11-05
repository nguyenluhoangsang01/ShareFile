import Image from "next/image";
import { Dispatch, FunctionComponent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone: FunctionComponent<{ setFile: Dispatch<any> }> = ({
  setFile,
}) => {
  const onDrop = useCallback((acceptedFile: any) => {
    setFile(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
        "audio/*": [".mp3"],
        "video/*": [".mp4"],
      },
    });

  return (
    <section
      {...getRootProps()}
      className={`w-full h-80 text-center cursor-pointer focus:outline-none grid place-items-center border-2 border-dashed rounded-lg transition ${
        isDragActive
          ? isDragReject
            ? "border-red-600"
            : "border-green-600"
          : "border-yellow-600"
      }`}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        isDragReject ? (
          <p>
            File type not supported. Please upload a valid image, audio or video
            file.
          </p>
        ) : (
          <p>Drop the file here ...</p>
        )
      ) : (
        <div className="grid place-items-center gap-4 text-center">
          <Image
            src="/images/folder.png"
            alt="folder-icon"
            width={64}
            height={64}
          />
          <p>Drag & drop some file here, or click to select file.</p>
          <em>
            (Only *.png, *.jpg, *.jpeg, *.ico, *.mpeg, *.mp3 and *.mp4 will be
            accepted)
          </em>
        </div>
      )}
    </section>
  );
};

export default Dropzone;
