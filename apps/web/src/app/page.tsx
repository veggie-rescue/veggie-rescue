"use client";
import Image from "next/image";
import Styles from "./page.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Access() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setError("Please enter the access code.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/sheets`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${trimmedPassword}`,
        },
    });

    if (res.ok) {
        login(trimmedPassword);
        router.replace("/dashboard");
        return;
    }

    if(res.status === 401) {
        setError("Invalid access code");
        return;
    }
    setError("An unexpected error occurred. Please try again.");
  }

    return (
        <main className={Styles.page}>
            <div className={Styles.card}>
                <div className={Styles.container}>
                    <div className={Styles.logoShell}>
                        <Image
                            src="/veggie-rescue-logo.png"
                            alt="Veggie Rescue logo"
                            className={Styles.image}
                            width={104}
                            height={104}
                            priority
                        />
                    </div>
                    <div className={Styles.brandBlock}>
                        <h1 className={Styles.title}>Veggie Rescue</h1>
                        <p className={Styles.subtitle}>Fresh food, less waste.</p>
                    </div>
                    <form 
                        className={Styles.form} 
                        onSubmit={handleSubmit}>
                        <div className={Styles.inputWrap}>
                            <input
                                className={Styles.textbox}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={Styles.eyeButton}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((current) => !current)}
                            >
                                <Image
                                    src={showPassword ? "/password_close.svg" : "/password_open.svg"}
                                    alt=""
                                    width={24}
                                    height={24}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <button className={Styles.submitButton} type="submit"> Submit </button>
                    </form>
                    {error && <p className={Styles.error}>{error}</p>}

                </div>
            </div>
        </main>
    )
}
