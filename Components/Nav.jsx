import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link href="/Home" className={styles.link}>Inicio</Link>
      <Link href="/Reporte1" className={styles.link}>Reporte 1</Link>
      <Link href="/Reporte2" className={styles.link}>Reporte 2</Link>
      <Link href="/Reporte3" className={styles.link}>Reporte 3</Link>
      <Link href="/Reporte4" className={styles.link}>Reporte 4</Link>
    </nav>
  );
}

