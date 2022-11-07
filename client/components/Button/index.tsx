import React, { FunctionComponent } from "react";
import { FiLoader } from "react-icons/fi";

const Button: FunctionComponent<{
  isLoading: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}> = ({ isLoading, text, onClick }) => {
  return (
    <button
      type="submit"
      className="w-full md:w-44 bg-gray-900 p-2 rounded-md hover:scale-105 active:scale-100 transition disabled:cursor-not-allowed disabled:bg-[#ccc] disabled:hover:scale-100 mt-4"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <FiLoader className="animate-spin w-6 h-6 mx-auto text-gray-900" />
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
