import toast from "react-hot-toast";

export const sizeInKB = (bytes: number) => `${Math.ceil(bytes / 1024)} KB`;

export const sendToast = (message: string, icon: JSX.Element) => {
  toast(message, {
    icon,
    duration: 5000,
    position: "top-right",
  });
};
