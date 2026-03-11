"use client";
import Image from "next/image";
import Styles from "./page.module.scss";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; 
import { useRouter } from "next/navigation";

export default function Access() {
const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();  
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      setError("");
      router.replace("/dashboard");
      return;
    }
    setError("Invalid access code");
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
