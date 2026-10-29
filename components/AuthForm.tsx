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
import { Sparkles, Loader2 } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp, signInAsDemoUser } from "@/lib/actions/auth.action";
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
  const [isDemoLoading, setIsDemoLoading] = useState(false);

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
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        toast.error("Invalid email or password. Try 'Quick Demo Sign-In' below to test immediately!");
      } else if (msg.includes("auth/email-already-in-use")) {
        toast.error("This email is already in use. Please sign in instead.");
      } else {
        toast.error(`Authentication error: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    try {
      const res = await signInAsDemoUser();
      if (res.success) {
        toast.success("Welcome! Signed in as Demo Candidate (Alex Developer).");
        router.push("/");
      } else {
        toast.error("Demo sign-in failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(`Error: ${err?.message || err}`);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-141.5">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            height={32}
            width={38}
            className="h-auto w-auto"
          />
          <h2 className="text-primary-100">IntervixAI</h2>
        </div>

        <h3 className="text-center text-light-100/80">Practice job interviews with AI</h3>

        {/* Quick Demo Sign-In */}
        <div className="p-4 rounded-xl border border-primary-200/20 bg-primary-200/5 flex flex-col gap-2">
          <p className="text-xs text-primary-200 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Quick Access
          </p>
          <p className="text-xs text-light-100/70">
            Instantly explore all interviews, mock practice, question banks, and analytics without setting up credentials:
          </p>
          <Button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isDemoLoading || isLoading}
            className="btn-primary w-full mt-1 flex items-center justify-center gap-2"
          >
            {isDemoLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>Sign In as Demo Candidate</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs uppercase tracking-wider text-light-100/40 font-mono">
            Or with email
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn w-full flex items-center justify-center gap-2" type="submit" disabled={isLoading || isDemoLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              <span>{isSignIn ? "Sign In" : "Create an Account"}</span>
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-light-100/70">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary-200 hover:underline ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
