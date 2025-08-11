"use client";
import { useState } from "react";
import NavBar from "@/Components/Nav";
import styles from "./Reporte2.module.css";
import Swal from "sweetalert2";
export default function Reporte2() {
  const [fecha, setFecha] = useState("");
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarPorFecha = () => {
    if (!fecha) {
      Swal.fire({
        title: "Falta escoger una fecha",
        text: "Seleccione una fecha, para encontrar sus clases",
        icon: 'info',
        confirmButtonText: "Entendido",
      });
      return;
    }
    setLoading(true);
    fetch(`/api/reporte2?fecha=${fecha}`)
      .then(res => res.json())
      .then(data => {
        setClases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando datos:", err);
        setLoading(false);
      });
  };

  const formatearFechaClase = (fecha) => {
    if (!fecha) return 'Sin fecha';
    let fecha1 = new Date(fecha);
    let dia = fecha1.getDate(); //Dia del mes
    let mes = fecha1.getMonth(); //Mes(empieza desde cero)
    let anio = fecha1.getFullYear(); //Año

    return `${dia + 1}/${mes + 1}/${anio}`;
  }
  const formatearNombre = (string) => {
    if (!string) return 'No existe';
    let primeraLetra = string.substring(0, 1);
    let restoLetra = string.substring(1, string.length);
    return `${primeraLetra.toUpperCase()}${restoLetra.toLowerCase()}`;

  }

  return (
    <>
      <NavBar />
      <div className={styles.reporteContainer}>
        <h1 className={styles.title}>
          Reporte 2: Profesores que han presentado clase en una fecha
        </h1>

        <div className={styles.controls}>
          <input
            type="date"
            className={styles.dateInput}
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
          <button
            className={styles.button}
            onClick={buscarPorFecha}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {clases.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre Docente</th>
                <th>Curso</th>
                <th>Título Clase</th>
                <th>Fecha Clase</th>
              </tr>
            </thead>
            <tbody>
              {clases.map(c => (
                <tr key={c.idclase}>
                  <td>
                    {c.docente
                      ? `${formatearNombre(c.docente.nombre)} ${c.docente.apellidopaterno} ${c.docente.apellidomaterno}`
                      : "Sin docente"}
                  </td>
                  <td>{c.curso?.nombrecurso || "Sin curso"}</td>
                  <td>{c.tituloclase}</td>
                  <td>{formatearFechaClase(c.fechaclase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading &&
          fecha && <div className={styles.noData}>No se encontraron clases en esa fecha</div>
        )}
      </div>
    </>
  );
}
