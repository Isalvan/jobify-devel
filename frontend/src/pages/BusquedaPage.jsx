import './css/BusquedaPage.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PaginaBusqueda() {
    const navegar = useNavigate()

    const empleosEjemplo = [
        {
            id: 1,
            titulo: 'Oferta 1',
            empresa: 'Empresa 1',
            ubicacion: 'Ciudad, País',
            salario: 30,
            tipo: 'Remoto',
            categoria: 'Tecnología',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Tecnología'],
            imagen: 'https://placehold.co/100x100',
            dias: 2
        },
        {
            id: 2,
            titulo: 'Oferta 2',
            empresa: 'Empresa 2',
            ubicacion: 'Ciudad, País',
            salario: 40,
            tipo: 'Presencial',
            categoria: 'Marketing',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Marketing', 'Ventas'],
            imagen: 'https://placehold.co/100x100',
            dias: 1
        },
        {
            id: 3,
            titulo: 'Oferta 3',
            empresa: 'Empresa 3',
            ubicacion: 'Ciudad, País',
            salario: 35,
            tipo: 'Híbrido',
            categoria: 'Diseño',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Diseño'],
            imagen: 'https://placehold.co/100x100',
            dias: 0
        }
    ]

    const categorias = [
        'Tecnología',
        'Marketing',
        'Diseño',
        'Ventas'
    ]

    // Estados de filtros
    const [ubicacion, setUbicacion] = useState('')
    const [salarioMin, setSalarioMin] = useState('')
    const [salarioMax, setSalarioMax] = useState('')
    const [tipoJornada, setTipoJornada] = useState('')
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')

    function aplicarFiltros() {
        const parametros = new URLSearchParams()
        if (ubicacion) parametros.append('ubicacion', ubicacion)
        if (salarioMin) parametros.append('salarioMin', salarioMin)
        if (salarioMax) parametros.append('salarioMax', salarioMax)
        if (tipoJornada) parametros.append('tipo', tipoJornada)
        if (categoriaSeleccionada) parametros.append('categoria', categoriaSeleccionada)
        navegar(`?${parametros.toString()}`)
    }

    function limpiarFiltros() {
        setUbicacion('')
        setSalarioMin('')
        setSalarioMax('')
        setTipoJornada('')
        setCategoriaSeleccionada('')
    }

    function formatearDias(dias) {
        if (dias === 0) return 'Publicado hoy'
        if (dias === 1) return 'Publicado ayer'
        return `Publicado hace ${dias} días`
    }

    return (
        <div className="busqueda-page">
            {/* Filtros */}
            <aside className="bp-filters">
                <div className="filter-card">
                    <h5 className="mb-3">Filtros</h5>

                    {/* Ubicación */}
                    <div className="filter-section">
                        <div className="filter-title">Ubicación</div>
                        <input
                            type="text"
                            className="form-control"
                            value={ubicacion}
                            onChange={e => setUbicacion(e.target.value)}
                            placeholder="Elige ciudad, región o país..."
                        />
                    </div>

                    {/* Salario */}
                    <div className="filter-section">
                        <div className="filter-title">Rango salarial</div>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                className="form-control"
                                value={salarioMin}
                                onChange={e => setSalarioMin(e.target.value)}
                                placeholder="Min"
                            />
                            <input
                                type="number"
                                className="form-control"
                                value={salarioMax}
                                onChange={e => setSalarioMax(e.target.value)}
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    {/* Tipo de jornada */}
                    <div className="filter-section">
                        <div className="filter-title">Tipo de jornada</div>
                        <label className="checkbox d-block">
                            <input type="radio" name="tipoJornada" checked={tipoJornada === 'Presencial'} onChange={() => setTipoJornada('Presencial')} /> Presencial
                        </label>
                        <label className="checkbox d-block">
                            <input type="radio" name="tipoJornada" checked={tipoJornada === 'Remoto'} onChange={() => setTipoJornada('Remoto')} /> Remoto
                        </label>
                        <label className="checkbox d-block">
                            <input type="radio" name="tipoJornada" checked={tipoJornada === 'Híbrido'} onChange={() => setTipoJornada('Híbrido')} /> Híbrido
                        </label>
                    </div>

                    {/* Categoría */}
                    <div className="filter-section">
                        <div className="filter-title">Categoría</div>
                        <select className="form-select" value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
                            <option value="">-- Selecciona una categoría --</option>
                            {categorias.map((cat, i) => (
                                <option value={cat} key={i}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-actions d-grid mt-3">
                        <button className="btn btn-primary" onClick={aplicarFiltros}>Aplicar Filtros</button>
                        <button className="btn btn-link text-decoration-none" onClick={limpiarFiltros}>Limpiar Filtros</button>
                    </div>
                </div>
            </aside>

            {/* Resultados */}
            <main className="bp-results">
                <header className="results-header mb-3">
                    <h2 className="h4">Mostrando <strong>{empleosEjemplo.length}</strong> ofertas de empleo</h2>
                </header>

                <section className="results-list">
                    {empleosEjemplo.map(empleo => (
                        <article className="job-card mb-3" key={empleo.id}>
                            <div className="job-left me-3">
                                <img src={empleo.imagen} alt="logo" />
                            </div>
                            <div className="job-main">
                                <div className="job-header d-flex justify-content-between align-items-start">
                                    <div>
                                        <h4 className="job-title mb-1">{empleo.titulo}</h4>
                                        <div className="company text-muted small">{empleo.empresa} - <span className="location">{empleo.ubicacion}</span></div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="date text-muted small">{formatearDias(empleo.dias)}</div>
                                        <button className="bookmark material-symbols-outlined">bookmark</button>
                                    </div>
                                </div>

                                <p className="desc mt-2">{empleo.descripcion}</p>

                                <div className="tags mt-2">
                                    {empleo.etiquetas.map((t, i) => (<span className="tag me-2" key={i}>{t}</span>))}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Paginación */}
                <footer className="pagination mt-4 d-flex justify-content-center align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary">‹</button>
                    <button className="btn btn-sm btn-primary">1</button>
                    <button className="btn btn-sm btn-outline-secondary">2</button>
                    <button className="btn btn-sm btn-outline-secondary">3</button>
                    <span className="text-muted">…</span>
                    <button className="btn btn-sm btn-outline-secondary">10</button>
                    <button className="btn btn-sm btn-outline-secondary">›</button>
                </footer>
            </main>
        </div>
    )
}