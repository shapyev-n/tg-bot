import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export default function TelegramBot() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const messageModel = (data: FormData) => {
    let messageTG = `Email: <b>${data.email}</b>\n`;
    messageTG += `Username: <b>${data.name}</b>\n`;
    messageTG += `Subject: <b>${data.subject}</b>\n`;
    messageTG += `Message: <b>${data.message}</b>`;
    return messageTG;
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      parse_mode: "html",
      text: messageModel(data),
    });
    reset();
  };

  return (
    <div className="App">
      <h1>Send Message to Telegram</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <tr>
            <td>
              <label>Email:</label>
            </td>
            <td>
              <input
                type="text"
                placeholder="your email"
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
              />
              {errors.email && (
                <span style={{ color: "red" }}>email не валиден!</span>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="your name"
              />
              {errors.name && (
                <span style={{ color: "red" }}>Заполните поля!</span>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <label>Subject:</label>
            </td>
            <td>
              <input
                type="text"
                {...register("subject", { required: true })}
                placeholder="your subject"
              />
              {errors.subject && (
                <span style={{ color: "red" }}>Заполните поля!</span>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <label>Message:</label>
            </td>
            <td>
              <input
                type="text"
                {...register("message", { required: true })}
                placeholder="your message"
              />
              {errors.message && (
                <span style={{ color: "red" }}>Заполните поля!</span>
              )}
            </td>
          </tr>
          <tr>
            {isSubmitting ? (
              <button disabled type="button">
                send...
              </button>
            ) : (
              <button type="submit">Send</button>
            )}
          </tr>
        </table>
      </form>
    </div>
  );
}
