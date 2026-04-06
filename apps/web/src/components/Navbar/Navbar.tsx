'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/deliveries", label: "Deliveries" },
    { href: "/recipients", label: "Recipients" },
];

export const Navbar = () => {
    const path = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [path]);

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

                <button
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-navigation"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
                >
                    <span className={styles.menuButtonText}>Menu</span>
                    <span className={styles.menuIcon} aria-hidden="true">
                        <span className={styles.menuLine} />
                        <span className={styles.menuLine} />
                        <span className={styles.menuLine} />
                    </span>
                </button>

                <nav
                    id="primary-navigation"
                    className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ""}`}
                    aria-label="Primary"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${path === item.href ? styles.activeLink : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
