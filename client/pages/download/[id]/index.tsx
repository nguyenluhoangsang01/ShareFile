import axios from "axios";
import fileDownload from "js-file-download";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Button from "../../../components/Button";
import { sendToast, sizeInKB } from "../../../utils/helpers";

interface Props {
  [key: string]: any;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { id } = query;
  let data = null;

  try {
    const res = await axios({
      method: "GET",
      url: `files/${id}`,
    });

    data = res.data;
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      data,
    },
  };
}

const DownloadFile: NextPage<{ data: Props }> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const res = await axios({
        method: "GET",
        url: `files/${data.data._id}/download`,
        responseType: "blob",
      });

      fileDownload(res.data, data.data.originalname);

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

  return (
    <div>
      <Head>
        <title className="uppercase">{data.data.originalname} - Download</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data?.data && data?.status === 200 && data?.success ? (
        <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-full sm:w-96 rounded-xl p-4 gap-6">
          <div className="grid place-items-center gap-4 text-center">
            <Image
              src="/images/file-download.png"
              alt="file-download-icon"
              width={64}
              height={64}
              priority
            />
            <p>Your file is ready to be downloaded</p>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Image
                src={`/images/${data.data.format}.png`}
                alt={`images/${data.data.format}`}
                width={48}
                height={48}
              />
              <p className="font-medium">{data.data.originalname}</p>
            </div>

            <p>{sizeInKB(data.data.size)}</p>
          </div>

          <Button
            isLoading={isLoading}
            text="Download"
            onClick={handleDownload}
          />

          <button
            onClick={() => router.push("/")}
            className="place-self-start grid transition hover:text-yellow-600 mt-8"
          >
            <em className="underline">??????? Back to home page.</em>
          </button>
        </div>
      ) : (
        <em className="text-xl text-center tracking-widest">
          <span>
            Oops, file does not exist! Please check your URL again or back to
            home page.
          </span>{" "}
          <button onClick={() => router.push("/")}>???????</button>
        </em>
      )}
    </div>
  );
};

export default DownloadFile;
