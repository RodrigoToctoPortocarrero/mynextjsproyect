'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Formulario.module.css';
import Swal from "sweetalert2";
export default function Formulario() {
  const [nombre, setNombre] = useState('');
  const [contra, setContra] = useState('');
  const router = useRouter();

  function Ingresar(e) {
    e.preventDefault();
    if (nombre === '' || contra === '') {
      Swal.fire({
        title: "Faltan Datos",
        text: "Ingrese un nombre o una contraseña",
        icon: 'info',
        confirmButtonText: "Entendido",
      });
      return;
    }
    if (nombre === 'nelida' && contra === 'admin') {
      Swal.fire({
        title: "Ingreso al Sistema",
        text: "Bienvenida al sistema, Nélida",
        icon: 'success',
        confirmButtonText: "Continuar",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/Home');
        }
      });
    } else {
      Swal.fire({
        title: "La contraseña o el usuario estan mal",
        text: "Ingreso no autorizado",
        icon: 'error', // 🔹 Cambia a 'warning', 'error', 'success', etc.
        confirmButtonText: "Entendido",
      });
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={Ingresar}>
        <h1 className={styles.title}>Inicio de Sesión</h1>
        <label className={styles.label}>Ingresa su usuario</label>
        <input
          className={styles.input}
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label className={styles.label}>Ingrese su contraseña</label>
        <input
          className={styles.input}
          type="password"
          required
          value={contra}
          onChange={(e) => setContra(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Ingrese al sistema
        </button>
      </form>
    </div>
  )
}
