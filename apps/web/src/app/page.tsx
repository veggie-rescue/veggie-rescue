"use client";
import Image from "next/image";
import Styles from "./page.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Access() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/sheets", {
        method: "GET", 
        headers: {
            Authorization: `Bearer ${password}`,
        },
    });

    if (res.ok) {
        localStorage.setItem("accessCode", password);
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
