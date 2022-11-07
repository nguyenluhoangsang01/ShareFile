import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Button from "../components/Button";
import DownloadLink from "../components/DownloadLink";
import Dropzone from "../components/Dropzone";
import EmailForm from "../components/EmailForm";
import RenderFile from "../components/RenderFile";
import { UPLOAD_DATA } from "../utils/constants";
import { sendToast } from "../utils/helpers";

const Home: NextPage = () => {
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Perform localStorage action
    const item = localStorage.getItem(UPLOAD_DATA);
    if (item) {
      const parsedItem = JSON.parse(item);

      setData(parsedItem);
    }
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const { data: data } = await axios({
        method: "POST",
        url: "files/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData(data);
      localStorage.setItem(UPLOAD_DATA, JSON.stringify(data));

      setIsLoading(false);

      sendToast(data.message, <AiOutlineCheck className="text-green-600" />);
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        sendToast(
          error.response?.data.message,
          <AiOutlineClose className="text-red-600" />
        );
      }
    }
  };

  const handleReset = () => {
    setData(null);
    localStorage.removeItem(UPLOAD_DATA);
    setFile(null);
  };

  return (
    <div className="grid place-items-center gap-8 px-4">
      <Head>
        <title>Share File 👻</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="font-semibold text-center">
        Got a file? Share it like fake news
      </h1>

      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-full sm:w-96 rounded-xl p-4 gap-6">
        {!data && <Dropzone setFile={setFile} />}

        {file && <RenderFile file={file} />}

        {data && (
          <>
            <p className="text-center text-base w-full md:w-4/5">
              Great! File is uploaded, share this link with your friend
            </p>

            <DownloadLink downloadPageLink={data.data.linkDownload} />

            <EmailForm id={data.data.id} />
          </>
        )}

        {data ? (
          <Button
            isLoading={isLoading}
            onClick={handleReset}
            text="Upload a new file"
          />
        ) : (
          file && (
            <Button
              isLoading={isLoading}
              onClick={handleUpload}
              text="Upload"
            />
          )
        )}
      </div>
    </div>
  );
};

export default Home;
