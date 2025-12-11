import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppProvider';
import { api } from '../../utils/api';

export default function JobCard({ job, onToggleFavorite }) {
    const { user } = useContext(AppContext);
    const detailsUrl = `/ofertas/${job.id}`;
    const isCompany = user?.rol === 'EMPRESA';
    const formattedSalaryMin = job.salario_min 
        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumSignificantDigits: 3 }).format(job.salario_min) 
        : null;
    const formattedSalaryMax = job.salario_max 
        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumSignificantDigits: 3 }).format(job.salario_max) 
        : null;

    return (
        <article className="card-premium p-4">
            <div className="row g-0 align-items-center">
                <div className="col-auto me-4 d-none d-sm-block">
                    <div className="bg-light p-2 rounded d-flex align-items-center justify-content-center" style={{width: '70px', height: '70px'}}>
                        <img 
                            src={job.empresa?.logo ? api.getFileUrl(job.empresa.logo) : 'https://placehold.co/100x100'} 
                            alt="logo" 
                            className="img-fluid" 
                            style={{maxHeight: '100%', maxWidth: '100%'}}
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <h4 className="h5 mb-0 fw-bold">
                            <Link 
                                to={detailsUrl} 
                                state={{ oferta: job }} 
                                className="text-decoration-none text-dark"
                            >
                                {job.titulo}
                            </Link>
                        </h4>
                        {!isCompany && (
                            <button
                                className="btn btn-link p-0 text-decoration-none position-relative"
                                style={{zIndex: 2}}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleFavorite(job.id);
                                }}
                            >
                                <span className={`material-symbols-outlined ${job.is_favorito ? 'text-warning' : 'text-secondary'}`}>
                                    {job.is_favorito ? 'turned_in' : 'turned_in_not'}
                                </span>
                            </button>
                        )}
                    </div>
                    
                    <div className="mb-2 text-muted small">
                        <span className="fw-medium text-primary">{job.empresa?.nombre || 'Empresa Confidencial'}</span>
                        <span className="mx-2">•</span>
                        <span>{job.ubicacion}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-muted small text-truncate mb-3" style={{maxWidth: '90%'}}>
                        {job.descripcion}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mt-auto align-items-center">
                        <Link to={detailsUrl} state={{ oferta: job }} className="btn btn-premium rounded-pill px-4 stretched-link">
                            Ver oferta
                        </Link>
                        <span className="badge bg-light text-dark border fw-normal py-2">{job.tipo_jornada || 'Jornada completa'}</span>
                        {job.modalidad && <span className="badge bg-light text-dark border fw-normal">{job.modalidad}</span>}
                        {formattedSalaryMin && <span className="badge bg-green-50 text-success border border-success fw-normal">
                            {formattedSalaryMin}
                            {formattedSalaryMax ? ` - ${formattedSalaryMax}` : ''}
                        </span>}
                    </div>
                </div>
            </div>
        </article>
    );
}
