import React, { useCallback, useEffect, useState } from "react";
import { trpc } from "../client/utils/trpc";
import { toast } from "react-toastify";
import classnames from "classnames";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import {
  CreateUserInput,
  createUserSchema,
} from "../server/schema/trainer.schema";
import Link from "next/link";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();

  const { mutate: register } = trpc.useMutation("auth.register", {
    onSuccess(data) {
      toast("You were successfully registered!", {
        type: "success",
        position: "top-center",
      });
      router.push("/login");
    },
    onError(error: any) {
      console.log({ error });
      toast(error.message, {
        type: "error",
        position: "top-center",
      });
    },
  });

  const [starter, setStarter] = useState({} as any);

  const starters = [
    { id: 1, name: "Bulbasaur" },
    { id: 2, name: "Charmander" },
    { id: 3, name: "Squirtle" },
  ];

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitSuccessful, isSubmitting },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<CreateUserInput> = (values) => {
    // ? Execute the Mutation
    register(values);
  };

  useEffect(() => {
    console.log("starter changed");
    setValue("starter", starter.id);
  }, [starter]);

  return (
    <div
      id="register-page"
      className="w-screen h-screen flex justify-center items-center"
    >
      <div className="bg-white border-b-4 border-blue-500 w-3/4 lg:w-1/3 rounded-md">
        <div className="w-full p-4 px-8 border-b-2 font-black uppercase">
          DXPRPG / <span className="text-gray-400">Register</span>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="p-8 pb-4">
            <div className="mb-6">
              <FormInput
                label="Username"
                name="username"
                autoComplete="off"
                placeholder="username"
              />
            </div>

            <div className="mb-6">
              <FormInput
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="******************"
              />
            </div>

            <div className="mb-6">
              <FormInput
                label="Confirm Password"
                name="passwordConfirm"
                type="password"
                autoComplete="off"
                placeholder="******************"
              />
            </div>

            <div className="mb-6">
              <div className="block mb-4">
                <label
                  className="text-gray-700 text-sm font-bold"
                  htmlFor="starter"
                >
                  Select Starter
                </label>
                <FormInput
                  hidden={true}
                  name="starter"
                  type="number"
                  value={starter?.id ?? 0}
                />
              </div>
              <div className="grid grid-flow-col grid-cols-3 gap-x-[4px]">
                {starters.map((_starter) => {
                  return (
                    <div
                      key={_starter.id}
                      className={classnames([
                        "p-4 border flex justify-center items-center font-lighter",
                        starter.id == _starter.id
                          ? "bg-green-200 border-green-400"
                          : "cursor-pointer bg-white hover:bg-white/75 active:bg-white/50 text-gray-500",
                      ])}
                      onClick={() => setStarter(_starter)}
                    >
                      {_starter.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href={`/login`} className="text-blue-500">
                Have an account?
              </Link>
              <button
                disabled={isSubmitting}
                className="bg-indigo-500 hover:bg-indigo-700 disabled:bg-opacity-25 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
