import axios from "axios";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

axios.defaults.baseURL = "http://localhost:8000/api";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen grid place-items-center">
      <Toaster />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
