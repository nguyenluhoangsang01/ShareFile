import axios from "axios";
import { FunctionComponent, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { sendToast } from "../../utils/helpers";
import Button from "../Button";

const EmailForm: FunctionComponent<{ id: string }> = ({ id }) => {
  const [form, setForm] = useState({
    emailFrom: "",
    emailTo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);

    try {
      const { data } = await axios({
        method: "POST",
        url: "files/email",
        data: {
          ...form,
          id,
        },
      });

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
    <div className="flex flex-col items-center justify-center space-y-6">
      <h3>You can also send the file through email</h3>

      <form
        action="POST"
        className="space-y-4 flex flex-col items-center justify-center w-full"
      >
        <input
          type="email"
          name="emailFrom"
          placeholder="Email from..."
          value={form.emailFrom}
          onChange={(e) =>
            setForm({
              ...form,
              emailFrom: e.target.value,
            })
          }
          required
        />

        <input
          type="email"
          name="emailTo"
          placeholder="Email to..."
          value={form.emailTo}
          onChange={(e) =>
            setForm({
              ...form,
              emailTo: e.target.value,
            })
          }
          required
        />

        <Button
          isLoading={isLoading}
          onClick={handleSendEmail}
          text="Send email"
        />
      </form>
    </div>
  );
};

export default EmailForm;
