
import './css/BusquedaPage.css'

import { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import { jobService } from '../services/jobService'
import Paginator from '../components/common/Paginator'
import { AppContext } from '../contexts/AppProvider'

export default function PaginaBusqueda() {
    const navegar = useNavigate()
    const location = useLocation()
    const { user } = useContext(AppContext)

    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get('page')) || 1

    const [jobs, setJobs] = useState([])
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            try {
                const currentFilters = {}
                searchParams.forEach((value, key) => {
                    currentFilters[key] = value
                })

                const data = await jobService.getJobs(page, currentFilters)
                setJobs(data.data)
                setMeta(data.meta)
            } catch (error) {
                console.error("Error fetching jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [page, searchParams])

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > meta.last_page) return

        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', newPage)
        setSearchParams(newParams)
        window.scrollTo(0, 0)
    }

    const categorias = [
        'Tecnología',
        'Marketing',
        'Diseño',
        'Ventas'
    ]

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

    const handleToggleFavorite = async (jobId) => {
        if (!user) {
            navegar('/login', { state: { returnUrl: location.pathname } });
            return;
        }

        try {
            const response = await jobService.toggleFavorite(jobId);
            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId
                    ? { ...job, is_favorito: response.is_favorito }
                    : job
            ));
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <div className="busqueda-page">
            <aside className="bp-filters">
                <div className="filter-card">
                    <h5 className="mb-3">Filtros</h5>

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

            <main className="bp-results">
                <header className="results-header mb-3">
                    <h2 className="h4">Mostrando <strong>{meta.total || 0}</strong> ofertas de empleo</h2>
                </header>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <section className="results-list">
                            {jobs.map(empleo => {
                                return (
                                    <article className="job-card mb-3" key={empleo.id}>
                                        <div className="job-left me-3">
                                            <img src={empleo.empresa?.logo || 'https://placehold.co/100x100'} alt="logo" width="60" />
                                        </div>
                                        <div className="job-main">
                                            <div className="job-header d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h4 className="job-title mb-1">
                                                        <Link to={`/ofertas/${empleo.id}`} state={{ oferta: empleo }} className="text-decoration-none text-dark">
                                                            {empleo.titulo}
                                                        </Link>
                                                    </h4>
                                                    <div className="company text-muted small">{empleo.empresa?.nombre || 'Empresa Confidencial'} - <span className="location">{empleo.ubicacion}</span></div>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="date text-muted small">{new Date(empleo.created_at).toLocaleDateString()}</div>
                                                    <button
                                                        className="btn btn-link p-0 text-decoration-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleFavorite(empleo.id);
                                                        }}
                                                        title={empleo.is_favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                                                    >
                                                        <span
                                                            className={`material-symbols-outlined ${empleo.is_favorito ? 'text-warning' : 'text-secondary'}`}
                                                            style={{ color: empleo.is_favorito ? '#ffc107' : '' }}
                                                        >
                                                            {empleo.is_favorito ? 'turned_in' : 'turned_in_not'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="desc mt-2 text-truncate" style={{ maxWidth: '700px' }}>{empleo.descripcion}</p>

                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="tags">
                                                    <span className="tag me-2 badge bg-light text-dark border">{empleo.tipo_jornada || 'Jornada completa'}</span>
                                                    {empleo.modalidad && <span className="tag me-2 badge bg-light text-dark border">{empleo.modalidad}</span>}
                                                    {empleo.salario_min && <span className="tag me-2 badge bg-success-subtle text-success-emphasis border border-success-subtle">{empleo.salario_min} - {empleo.salario_max} €</span>}
                                                </div>
                                                <Link to={`/ofertas/${empleo.id}`} state={{ oferta: empleo }} className="btn btn-primary btn-sm">Ver oferta</Link>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </section>

                        <Paginator
                            currentPage={meta.current_page}
                            lastPage={meta.last_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>
        </div>
    )
}