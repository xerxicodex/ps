import React, { useCallback, useEffect, useState } from "react";
import { trpc } from '../client/utils/trpc';
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { LoginUserInput, loginUserSchema } from '../server/schema/user.schema';
import Link from "next/link";

export default function LoginPage() {
    const hello = trpc.useQuery(["hello"]);
    const { mutate: login } = trpc.useMutation("auth.login", {
        onSuccess(data) {
            toast("You were successfully logged in!", {
                type: 'success',
                position: 'top-center',
            });
        },
        onError(error: any) {
            toast(error.message, {
                type: 'error',
                position: 'top-center',
            });
        }
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
        <div id="login-page" className="w-screen h-screen flex justify-center items-center">
            <div className="bg-white border-b-4 border-indigo-500 w-3/4 lg:w-1/3 rounded-md">

                <div className="w-full p-4 px-8 border-b-2 font-black uppercase">
                    DXPRPG / <span className="text-gray-400">Login</span>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitHandler)} className="p-8 pb-4">
                        <div className="mb-6">
                            <FormInput label="Username" name="username" placeholder="username" />
                        </div>

                        <div className="mb-6">
                            <FormInput label="Password" name="password" type="password"  placeholder="******************" />
                        </div>

                        <div className="flex items-center justify-between">
                            <Link href={`/register`} className="text-blue-500">Need an account?</Link>
                            <button disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 disabled:bg-opacity-25 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Login
                            </button>
                        </div>
                    </form>
                </FormProvider>

            </div>
        </div>
    )
}