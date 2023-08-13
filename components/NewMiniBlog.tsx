import Input from "./Input";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Button from "./Button";
import { useState } from "react";
import { post } from "@/utils/functions";
interface Props {
  jwt: string | undefined;
  setNewBlog: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewMiniBlog: React.FC<Props> = ({ jwt, setNewBlog }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const closeWindow = () => {
    setNewBlog(false);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const input = {
      data: {
        title: data.title,
        content: data.content,
        user: 1,
      },
    };
    post("/mini-blogs", input, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
        closeWindow();
      });
  };
  return (
    <div className="fixed inset-0 z-30">
      <div
        className="fixed inset-0 bg-slate-600/[.5]"
        onClick={() => closeWindow()}
      ></div>
      <form
        className="bg-[#2b2a37] p-4 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4">
          <Input
            id="title"
            type="text"
            placeholder="标题"
            register={register}
            errors={errors}
            disabled={isLoading}
            required
          />
          <Input
            id="content"
            type="textarea"
            placeholder="内容"
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "发送中..." : "发送"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewMiniBlog;
