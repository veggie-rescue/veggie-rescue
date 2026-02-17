import Link from "next/link";
import styles from "./Navbar.module.scss";
import Image from "next/image";

export const Navbar = () => {
    return (
        <header className={styles.navbar}>
            <div className={styles.navbarContent}> 
                <div className={styles.logoWrap}>
                    <Image 
                        className={styles.logo} 
                        src={"/veggie-rescue-logo.png"}
                        alt="ToDo"
                        fill
                        priority
                    />
                </div>

                <nav className={styles.navLinks} aria-label="Primary"> 
                    <Link href="/dashboard" className={styles.navLink}> Dashboard </Link>
                </nav>
            </div>
        </header>
    )
}