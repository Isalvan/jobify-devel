import { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';

function CrearEditarOfertaModal({ show, onClose, offer, onSave }) {
    const isEdit = !!offer;
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        tipo_trabajo: 'Presencial',
        salario_min: '',
        salario_max: '',
        categoria_id: 1 // Default or dynamically loaded
    });

    useEffect(() => {
        if (offer) {
            setFormData({
                titulo: offer.titulo,
                descripcion: offer.descripcion,
                ubicacion: offer.ubicacion,
                tipo_trabajo: offer.tipo_trabajo,
                salario_min: offer.salario_min,
                salario_max: offer.salario_max,
                categoria_id: offer.categoria_id || 1
            });
        }
    }, [offer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await jobService.updateJob(offer.id, formData);
            } else {
                await jobService.createJob(formData);
            }
            onSave();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la oferta');
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Editar Oferta' : 'Nueva Oferta'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea className="form-control" name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange} required></textarea>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Ubicación</label>
                                    <input type="text" className="form-control" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Tipo de Trabajo</label>
                                    <select className="form-select" name="tipo_trabajo" value={formData.tipo_trabajo} onChange={handleChange}>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Remoto">Remoto</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Salario Mínimo</label>
                                    <input type="number" className="form-control" name="salario_min" value={formData.salario_min} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Salario Máximo</label>
                                    <input type="number" className="form-control" name="salario_max" value={formData.salario_max} onChange={handleChange} required />
                                </div>
                            </div>
                            {/* Categoria select could go here loading from backend */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">{isEdit ? 'Actualizar' : 'Crear'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearEditarOfertaModal;
