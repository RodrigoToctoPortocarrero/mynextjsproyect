'use client';
import { useEffect, useState } from 'react';
import NavBar from '@/Components/Nav';
import styles from './InsertarClase.module.css';
import Swal from "sweetalert2";
export default function InsertarClase() {
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [competenciasTexto, setCompetenciasTexto] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    idcurso: '',
    iddocente: '',
    competencia: '',
    fechaclase: '',
    tituloclase: '',
    presentacion: '',
    grados: '',
  });

  useEffect(() => {
    fetch('/api/cursos').then(res => res.json()).then(setCursos);
    fetch('/api/docente').then(res => res.json()).then(setDocentes);
  }, []);

  useEffect(() => {
    if (formData.idcurso) {
      fetch(`/api/competencias?curso=${formData.idcurso}`)
        .then(res => res.json())
        .then(setCompetencias);
    } else {
      setCompetencias([]);
    }
  }, [formData.idcurso]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetenciaSelect = e => {
    const nombre = e.target.value;
    if (nombre && !competenciasTexto.includes(nombre)) {
      const nuevoTexto = competenciasTexto ? `${competenciasTexto}, ${nombre}` : nombre;
      setCompetenciasTexto(nuevoTexto);
      setFormData(prev => ({ ...prev, competencia: nuevoTexto }));
    }
  };

  const InsertarClase = async e => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/clase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      Swal.fire({
        title: "Clase insertada correctamente",
        text: "Todo salio Bien",
        icon: 'success',
        confirmButtonText: "Entendido",
      });
      setFormData({
        idcurso: '',
        iddocente: '',
        competencia: '',
        fechaclase: '',
        tituloclase: '',
        presentacion: '',
        grados: '',
      });
      setCompetenciasTexto('');
    } else {
      Swal.fire({
        title: "Error al insertar clase",
        text: "Comunicarse con el Ing. Tocto Portocarrero Rodrigo Jesús",
        icon: 'error',
        confirmButtonText: "Entendido",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <form onSubmit={InsertarClase} className={styles.formContainer}>
        <h2 className={styles.title}>Registrar Nueva Clase</h2>

        <label>Curso</label>
        <select
          className={styles.inputBase}
          name="idcurso"
          onChange={handleChange}
          value={formData.idcurso}
          required
        >
          <option value="">Seleccione</option>
          {cursos.map(cur => (
            <option key={cur.idcurso} value={cur.idcurso}>
              {cur.nombrecurso}
            </option>
          ))}
        </select>

        <label>Docente</label>
        <select
          className={styles.inputBase}
          name="iddocente"
          onChange={handleChange}
          value={formData.iddocente}
          required
        >
          <option value="">Seleccione</option>
          {docentes.map(doc => (
            <option key={doc.iddocente} value={doc.iddocente}>
              {`${doc.apellidopaterno} ${doc.apellidomaterno} ${doc.nombre}`}
            </option>
          ))}
        </select>

        <label>Seleccionar competencia</label>
        <select className={styles.inputBase} onChange={handleCompetenciaSelect}>
          <option value="">Seleccione</option>
          {competencias.map(c => (
            <option key={c.idcompetencia} value={c.nombrecompetencia}>
              {c.nombrecompetencia}
            </option>
          ))}
        </select>

        <label>Competencias seleccionadas</label>
        <textarea
          className={styles.inputBase}
          name="competencia"
          value={competenciasTexto}
          onChange={(e) => {
            setCompetenciasTexto(e.target.value);
            setFormData(prev => ({ ...prev, competencia: e.target.value }));
          }}
          rows={3}
          placeholder="Aquí aparecerán las competencias seleccionadas"
        />

        <label>Fecha de la clase</label>
        <input
          className={styles.inputBase}
          type="date"
          name="fechaclase"
          onChange={handleChange}
          value={formData.fechaclase}
          required
        />

        <label>Título de la clase</label>
        <input
          className={styles.inputBase}
          type="text"
          name="tituloclase"
          onChange={handleChange}
          value={formData.tituloclase}
          required
        />

        <label>¿Presentó a tiempo?</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="presentacion"
              value="true"
              onChange={handleChange}
              checked={formData.presentacion === "true"}
            /> Sí
          </label>
          <label>
            <input
              type="radio"
              name="presentacion"
              value="false"
              onChange={handleChange}
              checked={formData.presentacion === "false"}
            /> No
          </label>
        </div>

        <label>Grados</label>
        <input
          className={styles.inputBase}
          type="text"
          name="grados"
          onChange={handleChange}
          value={formData.grados}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Guardando...' : 'Guardar Clase'}
        </button>
      </form>
    </>
  );
}
