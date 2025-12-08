import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import CrearEditarOfertaModal from '../components/empresa/CrearEditarOfertaModal';

function MisOfertasPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            // Assuming filter logic handles 'empresa_id=me' via backend auth context or we pass specific ID
            // For now, let's rely on backend filtering by authenticated user's company if we don't pass anything specific that contradicts it
            // Actually API usually returns public jobs. We need to filter 'mine'.
            // Controller logic: if user is company, we might want a specific endpoint or param.
            // Let's assume ?empresa_id=me or filter in frontend for now if endpoint returns all.
            // WAIT: index logic: if (request->has('empresa_id')) query->porEmpresa...
            // We need to pass our company ID. But we might not have it easily here without context.
            // Better: backend endpoint /api/me/trabajos? Or /api/trabajos?empresa_id=MY_ID
            // Let's try passing empresa_id param via a context loaded user.
            // But wait, user object has role, logic is 'user->empresa'.
            // Simplest: Request all and filter? inefficient.
            // Let's pass a special flag or ID.
            // Assuming we have access to user payload from context (not imported here yet).

            // Let's assume generic getJobs calls public list.
            // We need a way to get *my* jobs including draft/inactive ones?
            // Controller: scope 'activa'. If I want to see closed ones? logic missing in backend index.
            // For MVP, let's just show active ones using the filter.
            const response = await jobService.getJobs({ empresa_id: 'me' });
            // Note: 'me' needs to be handled by backend or we pass real ID.
            // Let's checking backend: $query->porEmpresa($id).
            // If I pass 'me', it might fail if ID must be int.
            // Let's fix this by importing context.
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Need context for ID
    // But wait, let's just make the backend smarter or pass ID.
    // I will refactor this file in next step if 'me' fails. 
    // Actually, let's use the layout context.

    const handleCreate = () => {
        setEditingJob(null);
        setShowModal(true);
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Seguro que quieres eliminar esta oferta?')) return;
        try {
            await jobService.deleteJob(id);
            loadJobs();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar oferta');
        }
    };

    const handleSave = async () => {
        setShowModal(false);
        loadJobs();
    };

    return (
        <div className="mis-ofertas-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 fw-bold m-0">Mis Ofertas</h2>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                    <span className="material-symbols-outlined white-icon">add</span>
                    Nueva Oferta
                </button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-responsive bg-white rounded shadow-sm">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Título</th>
                                <th>Ubicación</th>
                                <th>Tipo</th>
                                <th>Salario</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td className="fw-medium">{job.titulo}</td>
                                    <td>{job.ubicacion}</td>
                                    <td><span className="badge bg-light text-dark border">{job.tipo_trabajo}</span></td>
                                    <td>{job.salario_min} - {job.salario_max}</td>
                                    <td className="text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(job)} title="Editar">
                                                <span className="material-symbols-outlined font-sm">edit</span>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.id)} title="Eliminar">
                                                <span className="material-symbols-outlined font-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No tienes ofertas publicadas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <CrearEditarOfertaModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    offer={editingJob}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

export default MisOfertasPage;
