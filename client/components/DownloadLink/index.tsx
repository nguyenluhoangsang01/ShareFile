import Image from "next/image";
import { FunctionComponent, useState } from "react";
import { sendToast } from "../../utils/helpers";

const DownloadLink: FunctionComponent<{ downloadPageLink: string }> = ({
  downloadPageLink,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipBoard = () => {
    navigator.clipboard.writeText(downloadPageLink);

    setIsCopied(true);

    sendToast(
      "Copy to clipboard!",
      <Image src="/images/copy.png" alt="copy-icon" width={12} height={12} />
    );
  };

  return (
    <div className="flex items-center justify-between space-x-6 my-4">
      <a
        href={downloadPageLink}
        className={`transition break-all hover:underline ${isCopied ? "text-yellow-600" : ""}`}
        target="_blank"
      >
        {downloadPageLink}
      </a>
      <button
        className="transition hover:scale-105 active:scale-100"
        onClick={handleCopyToClipBoard}
      >
        <Image src="/images/copy.png" alt="copy-icon" width={24} height={24} />
      </button>
    </div>
  );
};

export default DownloadLink;
