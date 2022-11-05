import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import Dropzone from "../components/Dropzone";
import RenderFile from "../components/RenderFile";
import { sendToast } from "../utils/helpers";

const Home: NextPage = () => {
  const [file, setFile] = useState<any>(null);

  const handleUpload = () => {
    sendToast(
      "Uploading file...",
      <AiOutlineCheck className="text-green-600" />
    );
  };

  return (
    <div className="grid place-items-center gap-8 px-4">
      <Head>
        <title>Share file</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="font-semibold text-center">
        Got a file? Share it like fake news
      </h1>

      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-full sm:w-96 rounded-xl p-4 gap-6">
        <Dropzone setFile={setFile} />

        {file && <RenderFile file={file} />}

        <button
          type="submit"
          className="w-44 bg-gray-900 p-2 rounded-md hover:scale-105 active:scale-100 transition"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Home;
