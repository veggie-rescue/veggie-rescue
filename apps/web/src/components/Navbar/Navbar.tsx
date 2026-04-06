'use client'

import Link from "next/link";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const path = usePathname();

    return (
        <header className={styles.navbar}>
            <div className={styles.navbarContent}>
                <Link href="/dashboard" className={styles.brand}>
                    <div className={styles.logoWrap}>
                        <Image
                            className={styles.logo}
                            src={"/veggie-rescue-logo.png"}
                            alt="Veggie Rescue logo"
                            fill
                            priority
                        />
                    </div>
                    <span className={styles.brandText}>Veggie Rescue</span>
                </Link>

                <nav className={styles.navLinks} aria-label="Primary">
                    <Link href="/dashboard" className={`${styles.navLink} ${path === "/dashboard" ? styles.activeLink : ""}`}> Dashboard </Link>
                    <Link href="/deliveries" className={`${styles.navLink} ${path === "/deliveries" ? styles.activeLink : ""}`}> Deliveries </Link>
                    <Link href="/recipients" className={`${styles.navLink} ${path === "/recipients" ? styles.activeLink : ""}`}> Recipients </Link>
                </nav>
            </div>
        </header>
    )
}
