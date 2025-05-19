"use client";

import Input from "../Input";
import Button from "../Button";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface Props {
  loginFunction: (data: FieldValues) => void;
  loginError?: string;
}

const LoginForm: React.FC<Props> = ({ loginFunction, loginError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    loginFunction(data);
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <h3 className="text-center">登录</h3>
        <Input
          label="Email"
          id="email"
          type="email"
          register={register}
          errors={errors}
          disabled={isLoading}
          required
        />
        <Input
          label="Password"
          id="password"
          type="password"
          register={register}
          errors={errors}
          disabled={isLoading}
          required
        />
        <Button type="submit" fullWidth disabled={isLoading}>
          Login
        </Button>
      </form>
      {loginError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700">{loginError}</div>
      )}
    </div>
  );
};

export default LoginForm;
