import { getAuthSession } from "@/lib/nextauth";
import { TRPCError, initTRPC } from "@trpc/server";

// tRPC 初期化
const t = initTRPC.create();

// middleware で認証を行う
export const authMiddleware = t.middleware(async ({ next }) => {
  const user = await getAuthSession();

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(authMiddleware);
