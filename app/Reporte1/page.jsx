"use client";
import { useState, useEffect } from "react";
import NavBar from "@/Components/Nav";
import styles from "./Reporte1.module.css";
import Swal from "sweetalert2";
export default function Reporte1() {
  const [docentes, setDocentes] = useState([]);
  const [iddocente, setIddocente] = useState("");
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/docente")
      .then(res => res.json())
      .then(data => setDocentes(data))
      .catch(err => console.error("Error cargando docentes:", err));
  }, []);

  const buscarClases = () => {
    if (!iddocente) {
      Swal.fire({
        title: "Falta escoger un docente",
        text: "Seleccione un docente, para encontrar sus clases",
        icon: 'info',
        confirmButtonText: "Entendido",
      });
      return;
    }
    setLoading(true);
    fetch(`/api/clase/docente?iddocente=${iddocente}`)
      .then(res => res.json())
      .then(data => {
        setClases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando clases:", err);
        setLoading(false);
      });
  };
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(fecha));
  };
  const formatearFechaClase = (fecha) => {
    if (!fecha) return 'Sin fecha';
    let fecha1 = new Date(fecha);
    let dia = fecha1.getDate(); //Dia del mes
    let mes = fecha1.getMonth(); //Mes(empieza desde cero)
    let anio = fecha1.getFullYear(); //Año

    return `${dia + 1}/${mes + 1}/${anio}`;
  }

  return (
    <>
      <NavBar />
      <div className={styles.reporteContainer}>
        <h1 className={styles.title}>Reporte 1: Clases por Docente</h1>

        <select
          className={styles.select}
          value={iddocente}
          onChange={e => setIddocente(e.target.value)}
        >
          <option value="">Seleccione un docente</option>
          {docentes.map(d => (
            <option key={d.iddocente} value={d.iddocente}>
              {d.nombre} {d.apellidopaterno} {d.apellidomaterno}
            </option>
          ))}
        </select>

        <button
          className={styles.button}
          onClick={buscarClases}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        {clases.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Título</th>
                <th>Fecha Clase</th>
                <th>Competencia</th>
                <th>Fecha Entrega</th>
                <th>¿Presentó a tiempo?</th>
                <th>Grados</th>
              </tr>
            </thead>
            <tbody>
              {clases.map(c => (
                <tr key={c.idclase}>
                  <td>{c.curso?.nombrecurso || "Sin curso"}</td>
                  <td>{c.tituloclase}</td>
                  <td>{formatearFechaClase(c.fechaclase)}</td>
                  <td>{c.competencia}</td>
                  <td>{formatearFecha(c.fechaentrega)}</td>
                  <td>{c.presentacion ? "SI" : "NO"}</td>
                  <td>{c.grados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          iddocente && <div className={styles.noData}>Este docente no tiene clases aún</div>
        )}
      </div>
    </>
  );
}
