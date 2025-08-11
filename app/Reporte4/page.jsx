"use client";
import { useState, useEffect } from "react";
import NavBar from "@/Components/Nav";
import styles from "./Reporte4.module.css";
import Swal from "sweetalert2";
export default function Reporte4() {
  const [docentes, setDocentes] = useState([]);
  const [iddocente, setIddocente] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar docentes
  useEffect(() => {
    fetch("/api/docente")
      .then(res => res.json())
      .then(data => setDocentes(data))
      .catch(err => console.error("Error cargando docentes:", err));
  }, []);

  const buscarClases = () => {
    if (!iddocente || !dia || !mes || !anio) {
      Swal.fire({
        title: "Falta escoger algunos datos",
        text: "Seleccione bien los datos, para encontrar sus clases",
        icon: 'info',
        confirmButtonText: "Entendido",
      });
      return;
    }
    setLoading(true);
    fetch(`/api/reporte4?dia=${dia}&mes=${mes}&anio=${anio}&iddocente=${iddocente}`)
      .then(res => res.json())
      .then(data => {
        setResultado(data);
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

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Reporte 4: Clases por docente en una fecha exacta</h1>

        {/* Select docente */}
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

        {/* Día */}
        <input
          type="number"
          placeholder="Día"
          className={styles.input}
          value={dia}
          onChange={e => setDia(e.target.value)}
          min="1"
          max="31"
        />

        {/* Mes */}
        <select
          className={styles.select}
          value={mes}
          onChange={e => setMes(e.target.value)}
        >
          <option value="">Mes</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Año */}
        <input
          type="number"
          placeholder="Año"
          className={styles.input}
          value={anio}
          onChange={e => setAnio(e.target.value)}
        />

        {/* Botón */}
        <button
          onClick={buscarClases}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        {/* Resultados */}
        {resultado && !resultado.error && (
          <div className={styles.resultBox}>
            <h3>
              El docente tuvo
              <strong>  {resultado.cantidadClases}</strong> clase(s) el{" "}
              {resultado.dia}/{resultado.mes}/{resultado.anio}.
            </h3>

            {resultado.clases.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Curso</th>
                    <th style={{ textAlign: 'center' }}>Título</th>
                    <th style={{ textAlign: 'center' }}>Fecha de Clase</th>
                    <th style={{ textAlign: 'center' }}>Competencias</th>
                    <th style={{ textAlign: 'center' }}>¿Presento a tiempo?</th>
                    <th style={{ textAlign: 'center' }}>Grados</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.clases.map(c => (
                    <tr key={c.idclase}>
                      <td style={{ textAlign: 'center' }}>{c.curso?.nombrecurso || "—"}</td>
                      <td style={{ textAlign: 'center' }}>{c.tituloclase}</td>
                      <td style={{ textAlign: 'center' }}>{formatearFechaClase(c.fechaclase)}</td>
                      <td style={{ textAlign: 'center' }}>{c.competencia}</td>
                      <td style={{ textAlign: 'center' }}>{c.presentacion ? "Sí" : "No"}</td>
                      <td style={{ textAlign: 'center' }}>{c.grados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Error */}
        {resultado && resultado.error && (
          <div className={styles.error}>
            <strong>{resultado.error}</strong>
          </div>
        )}
      </div>
    </>
  );
}
