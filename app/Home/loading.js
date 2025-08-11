
import styles from './Loading.module.css';

export default function Loading() {
    return (
        <div className={styles.page}>
            <div className={styles.spinner}></div>
            <h1 className={styles.text}>Cargando, espere un momento...</h1>
        </div>
    )
}

