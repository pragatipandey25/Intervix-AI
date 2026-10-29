"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
          avatarUrl: userCredential.user.photoURL,
        });

        if (!result.success) {
          toast.error(result.message);
          setIsLoading(false);
          return;
        }

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign up Failed. Please try again.");
          setIsLoading(false);
          return;
        }

        const signInResult = await signIn({
          email,
          idToken,
        });

        if (!signInResult.success) {
          toast.error(signInResult.message);
          setIsLoading(false);
          return;
        }

        toast.success("Account created successfully.");
        router.push("/");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          setIsLoading(false);
          return;
        }

        const result = await signIn({
          email,
          idToken,
        });

        if (!result.success) {
          toast.error(result.message);
          setIsLoading(false);
          return;
        }

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      const msg = error?.message || String(error);
      if (
        msg.includes("auth/invalid-credential") ||
        msg.includes("auth/wrong-password")
      ) {
        toast.error("Invalid email or password.");
      } else if (msg.includes("auth/email-already-in-use")) {
        toast.error("This email is already in use. Please sign in instead.");
      } else {
        toast.error(`Authentication error: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-141.5">
      <div className="flex flex-col gap-6 card py-12 px-10">
        <div className="flex flex-row gap-2.5 justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            height={36}
            width={42}
            className="h-auto w-auto"
          />
          <h2 className="text-2xl font-bold text-primary-100 tracking-tight">
            IntervixAI
          </h2>
        </div>

        <p className="text-center text-sm text-light-100/75">
          {isSignIn
            ? "Sign in to access your AI interview workspace"
            : "Create your account to start preparing for top roles"}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              className="btn w-full flex items-center justify-center gap-2 py-6 rounded-xl font-semibold shadow-md"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              <span>{isSignIn ? "Sign In" : "Create Account"}</span>
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-light-100/70 pt-2">
          {isSignIn ? "Don't have an account?" : "Already registered?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-semibold text-primary-200 hover:underline ml-1.5"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
