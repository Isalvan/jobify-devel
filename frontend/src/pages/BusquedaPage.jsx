
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import { jobService } from '../services/jobService'
import { categoryService } from '../services/categoryService'
import Paginator from '../components/common/Paginator'
import JobCard from '../components/jobs/JobCard'
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
    const [error, setError] = useState(null)

    // Listas para dropdowns
    const [locationsList, setLocationsList] = useState([])
    const [categories, setCategories] = useState([])

    // Estado del formulario (Filtros pendientes de aplicar)
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        location: searchParams.get('location') || '',
        salary_min: searchParams.get('salary_min') || '',
        salary_max: searchParams.get('salary_max') || '',
        job_type: searchParams.get('job_type') || '',
        modalidad: searchParams.get('modalidad') || '',
        category_id: searchParams.get('category_id') || ''
    })

    useEffect(() => {
        // Cargar listas de filtros
        jobService.getLocations().then(data => setLocationsList(data))
        categoryService.getCategories().then(data => setCategories(data))
    }, [])

    useEffect(() => {
        // Sincronizar filtros con URL al cargar o navegar
        setFilters({
            search: searchParams.get('search') || '',
            location: searchParams.get('location') || '',
            salary_min: searchParams.get('salary_min') || '',
            salary_max: searchParams.get('salary_max') || '',
            job_type: searchParams.get('job_type') || '',
            modalidad: searchParams.get('modalidad') || '',
            category_id: searchParams.get('category_id') || ''
        })
    }, [searchParams])

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            setError(null)
            try {
                // Construir params desde URL (source of truth)
                const currentFilters = {
                    search: searchParams.get('search'),
                    location: searchParams.get('location'),
                    salary_min: searchParams.get('salary_min'),
                    salary_max: searchParams.get('salary_max'),
                    job_type: searchParams.get('job_type'),
                    modalidad: searchParams.get('modalidad'),
                    category_id: searchParams.get('category_id'),
                    empresa_id: searchParams.get('empresa_id'),
                    page
                }
                // Limpiar undefined/null/empty
                const cleanParams = Object.fromEntries(
                    Object.entries(currentFilters).filter(([_, v]) => v != null && v !== '')
                );

                const data = await jobService.getJobs(cleanParams)
                setJobs(data.data)
                setMeta(data.meta)
            } catch (err) {
                console.error(err)
                setError("Ocurrió un error al cargar las ofertas.")
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [page, searchParams])

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    const aplicarFiltros = () => {
        const params = { ...filters, page: 1 }
        // Eliminar vacios
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '')
        );
        setSearchParams(cleanParams)
        window.scrollTo(0, 0)
    }

    const limpiarFiltros = () => {
        const emptyFilters = {
            search: '',
            location: '',
            salary_min: '',
            salary_max: '',
            job_type: '',
            modalidad: '',
            category_id: ''
        }
        setFilters(emptyFilters)
        setSearchParams({ page: 1 })
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > meta.last_page) return
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.set('page', newPage)
            return newParams
        })
        window.scrollTo(0, 0)
    }

    const handleToggleFavorite = async (jobId) => {
        if (!user) {
            navegar('/login', { state: { returnUrl: location.pathname + location.search } });
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
        <div className="container py-5">
            <div className="row g-4">
                {/* Sidebar Filtros */}
                <aside className="col-12 col-md-4 col-lg-3">
                    <div className="card-premium p-4 sticky-top" style={{ top: '6rem', zIndex: 100 }}>
                        <h5 className="mb-4 fw-bold text-gradient">Filtros</h5>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Búsqueda</label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-secondary ms-2" style={{fontSize: '18px'}}>search</span>
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={e => handleFilterChange('search', e.target.value)}
                                    placeholder="Cargo, empresa..."
                                    style={{fontSize: '0.9rem'}}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Ubicación</label>
                            <div className="input-group-premium">
                                <span className="material-symbols-outlined text-secondary ms-2" style={{fontSize: '18px'}}>location_on</span>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={e => handleFilterChange('location', e.target.value)}
                                    placeholder="Ciudad..."
                                    style={{fontSize: '0.9rem'}}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Rango salarial</label>
                            <div className="d-flex gap-2">
                                <div className="input-group-premium p-1">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={filters.salary_min}
                                        onChange={e => handleFilterChange('salary_min', e.target.value)}
                                        onKeyDown={(e) => ['-', '+', 'e', 'E', '.', ','].includes(e.key) && e.preventDefault()}
                                        placeholder="Min"
                                        className="text-center"
                                        style={{fontSize: '0.9rem'}}
                                    />
                                </div>
                                <div className="input-group-premium p-1">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={filters.salary_max}
                                        onChange={e => handleFilterChange('salary_max', e.target.value)}
                                        onKeyDown={(e) => ['-', '+', 'e', 'E', '.', ','].includes(e.key) && e.preventDefault()}
                                        placeholder="Max"
                                        className="text-center"
                                        style={{fontSize: '0.9rem'}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Jornada</label>
                            <select 
                                className="form-select border-0 bg-transparent shadow-none" 
                                value={filters.job_type} 
                                onChange={e => handleFilterChange('job_type', e.target.value)}
                                style={{fontSize: '0.9rem'}}
                            >
                                <option value="">Cualquiera</option>
                                <option value="Tiempo Completo">Jornada Completa</option>
                                <option value="Medio Tiempo">Media Jornada</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Temporal">Temporal</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Modalidad</label>
                            <select 
                                className="form-select border-0 bg-transparent shadow-none" 
                                value={filters.modalidad} 
                                onChange={e => handleFilterChange('modalidad', e.target.value)}
                                style={{fontSize: '0.9rem'}}
                            >
                                <option value="">Cualquiera</option>
                                <option value="PRESENCIAL">Presencial</option>
                                <option value="REMOTO">Remoto</option>
                                <option value="HIBRIDO">Híbrido</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium small text-muted">Categoría</label>
                            <div className="input-group-premium p-0">
                                <select 
                                    className="form-select border-0 bg-transparent shadow-none" 
                                    value={filters.category_id} 
                                    onChange={e => handleFilterChange('category_id', e.target.value)}
                                    style={{fontSize: '0.9rem'}}
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option value={cat.id} key={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <button className="btn-premium w-100 justify-content-center" onClick={aplicarFiltros}>
                                Aplicar
                            </button>
                            <button className="btn btn-link text-muted text-decoration-none btn-sm" onClick={limpiarFiltros}>
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Resultados */}
                <main className="col-12 col-md-8 col-lg-9">
                    <header className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h5 fw-bold mb-0">
                            Mostrando <span className="text-primary">{meta.total || 0}</span> ofertas
                        </h2>
                    </header>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-column gap-3">
                                {jobs.map(empleo => (
                                    <JobCard 
                                        key={empleo.id} 
                                        job={empleo} 
                                        onToggleFavorite={handleToggleFavorite} 
                                    />
                                ))}
                            </div>

                            <div className="mt-5 d-flex justify-content-center">
                                <Paginator
                                    currentPage={meta.current_page}
                                    lastPage={meta.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}