import { publicProcedure, privateProcedure, router } from "@/trpc/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export const authRouter = router({
  singUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { name, email, password } = input;

        // メールアドレスが既に登録されているか確認
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "既に登録されているメールアドレスです",
          });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, 12);

        // ユーザーの作成
        await prisma.user.create({
          data: {
            name,
            email,
            hashedPassword,
          },
        });
      } catch (error) {
        console.log(error);

        if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "予期せぬエラーが発生しました",
          });
        }
      }
    }),
});
