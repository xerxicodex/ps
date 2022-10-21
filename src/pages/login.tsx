import React, { useEffect } from "react";
import { trpc } from "../client/utils/trpc";
import { toast } from "react-toastify";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../client/components/FormInput";
import {
    LoginUserInput,
    loginUserSchema,
} from "../server/schema/trainer.schema";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginPage() {
    const router = useRouter();

    const { mutate: login } = trpc.useMutation("auth.login", {
        onSuccess(data) {
            toast("You were successfully logged in!", {
                type: "success",
                position: "top-center",
            });
            router.push("/");
        },
        onError(error: any) {
            toast(error.message, {
                type: "error",
                position: "top-center",
            });
        },
    });

    const methods = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema),
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

    const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
        // ? Execute the Mutation
        login(values);
    };

    return (
        <div
            id="login-page"
            className="w-screen h-screen bg-slate-50 flex justify-center items-center"
        >
            <div className="bg-white shadow-md border-b-4 border-indigo-200 w-5/6 lg:w-1/3 rounded-md">
                <div className="w-full p-4 md:px-8 border-b-2 bg-indigo-200 font-black uppercase">
                    DXPRPG / <span className="opacity-50">Login</span>
                </div>

                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmitHandler)}
                        className="p-4 md:p-8 pb-4"
                    >
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

                        <div className="flex items-center justify-between">
                            <Link href={`/register`} className="text-blue-500">
                                Need an account?
                            </Link>
                            <button
                                disabled={isSubmitting}
                                className="bg-blue-500 hover:bg-blue-700 disabled:bg-opacity-25 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
