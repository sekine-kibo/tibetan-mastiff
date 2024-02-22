"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { trpc } from "@/trpc/react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const schema = z.object({
  name: z.string().min(2, { message: "２文字以上で入力してください" }),
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" }),
  password: z.string().min(8, { message: "８文字以上で入力してください" }),
});

type InputType = z.infer<typeof schema>;

export default function Signup() {
  const router = useRouter();

  const form = useForm<InputType>({
    resolver: zodResolver(schema), // 入力値のバリデーション
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Googleアカウントでサインアップ
  async function handleGoogleSingup() {
    try {
      const result = await signIn("google", { callbackUrl: "/" });

      if (result?.error) {
        toast.error("アカウント作成に失敗しました");
      }
    } catch (error) {
      toast.error("アカウント作成に失敗しました");
    }
  }

  // メールアドレスでサインアップ
  // note: isPending が怪しい
  const { mutate: singUp, isPending } = trpc.auth.singUp.useMutation({
    onSuccess: () => {
      toast.success("アカウント作成に成功しました!");

      signIn("credentials", {
        email: form.getValues("email"),
        password: form.getValues("password"),
        callbackUrl: "/",
      });

      router.refresh();
    },
    onError: (error) => {
      toast.error("アカウント作成に失敗しました");
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    singUp(data);
  };

  return (
    <div className="max-w-[400px] m-auto">
      <div className="text-2xl font-bold text-center mb-10">新規登録</div>

      <Button variant="outline" className="w-full" onClick={handleGoogleSingup}>
        <FcGoogle className="mr-2 h-4 w-4" />
        Googleアカウント
      </Button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="名前" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="xxxx@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-gray-500">
            サインアップすることで、利用規約、プライバシーポリシーに同意したことになります。
          </div>

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            アカウント作成
          </Button>
        </form>
      </Form>

      <div className="text-center mt-5">
        <Link href="/login" className="text-sm text-blue-500">
          すでにアカウントをお持ちの方
        </Link>
      </div>
    </div>
  );
}
