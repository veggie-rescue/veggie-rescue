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
                    <Image src="/TODO-logo.png" alt="Access Image" className={Styles.image} width={15} height={15}/>
                    <form
                        className={Styles.form}
                        onSubmit={handleSubmit}>
                        <input
                            className={Styles.textbox}
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        <button className={Styles.submitButton} type="submit"> Submit </button>
                    </form>
                    {error && <p className={Styles.error}>{error}</p>}

                </div>
            </div>
        </main>
    )
}
