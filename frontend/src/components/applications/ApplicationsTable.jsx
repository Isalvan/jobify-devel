import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

function ApplicationsTable({ applications, onUpdateStatus }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleStatusChange = async (appId, newStatus) => {
    setLoadingId(appId);
    await onUpdateStatus(appId, newStatus);
    setLoadingId(null);
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="card-premium p-5 text-center">
        <span className="material-symbols-outlined fs-1 text-muted mb-3 opacity-50">folder_off</span>
        <h3 className="h5 text-muted fw-normal">No hay candidatos para esta oferta aún.</h3>
      </div>
    );
  }

  return (
    <div className="card-premium border-0 shadow-sm overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="ps-4 py-3 text-secondary border-0">Candidato</th>
              <th scope="col" className="py-3 text-secondary border-0">Fecha</th>
              <th scope="col" className="py-3 text-secondary border-0">Estado</th>
              <th scope="col" className="py-3 text-secondary border-0">Mensaje</th>
              <th scope="col" className="pe-4 py-3 text-end text-secondary border-0">Acciones</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="ps-4 py-3">
                  <div className="d-flex align-items-center">
                    <img
                      className="rounded-circle border"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      src={app.candidato.usuario?.avatar || `https://ui-avatars.com/api/?name=${app.candidato.usuario?.nombre || 'User'}&background=random`}
                      alt=""
                    />
                    <div className="ms-3">
                      <div className="fw-bold text-dark">
                        {app.candidato.usuario?.nombre} {app.candidato.usuario?.apellidos}
                      </div>
                      <div className="small text-muted">
                        {app.candidato.usuario?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <span className={`badge rounded-pill bg-opacity-10 
                    ${app.estado === 'PENDIENTE' ? 'bg-warning text-warning' : ''}
                    ${app.estado === 'ACEPTADO' || app.estado === 'FINALISTA' ? 'bg-success text-success' : ''}
                    ${app.estado === 'RECHAZADO' ? 'bg-danger text-danger' : ''}
                    ${!['PENDIENTE', 'ACEPTADO', 'FINALISTA', 'RECHAZADO'].includes(app.estado) ? 'bg-secondary text-secondary' : ''}
                  `}>
                    {app.estado}
                  </span>
                </td>
                <td className="py-3">
                  <span className="d-inline-block text-truncate text-muted" style={{ maxWidth: '200px' }} title={app.mensaje}>
                    {app.mensaje || <em className="text-muted small">Sin mensaje</em>}
                  </span>
                </td>
                <td className="pe-4 py-3 text-end">
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <Link to={`/perfil/${app.candidato.usuario?.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3" title="Ver Perfil">
                       Ver Perfil
                    </Link>

                    {app.cv && (
                        <a 
                            href={api.getFileUrl(app.cv)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0"
                            style={{width: '32px', height: '32px'}}
                            title="Descargar CV"
                        >
                            <span className="material-symbols-outlined fs-6">description</span>
                        </a>
                    )}
                    
                    {/* Botones de acción disponibles siempre para corregir errores */}
                    <div className="d-flex gap-1" style={{ minWidth: '70px', justifyContent: 'flex-end' }}>
                        {(['FINALISTA', 'ACEPTADO', 'RECHAZADO'].includes(app.estado)) ? (
                             <button
                                className="btn btn-sm btn-outline-warning rounded-circle d-flex align-items-center justify-content-center p-0"
                                style={{width: '32px', height: '32px'}}
                                title="Deshacer / Volver a Pendiente"
                                onClick={() => handleStatusChange(app.id, 'PENDIENTE')}
                                disabled={loadingId === app.id}
                            >
                                {loadingId === app.id ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span className="material-symbols-outlined fs-6">undo</span>
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center p-0"
                                    style={{width: '32px', height: '32px'}}
                                    title="Aceptar / Finalista"
                                    onClick={() => handleStatusChange(app.id, 'FINALISTA')}
                                    disabled={loadingId === app.id}
                                >
                                    {loadingId === app.id && app.targetStatus === 'FINALISTA' ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span className="material-symbols-outlined fs-6">check</span>
                                    )}
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center p-0"
                                    style={{width: '32px', height: '32px'}}
                                    title="Rechazar"
                                    onClick={() => handleStatusChange(app.id, 'RECHAZADO')}
                                    disabled={loadingId === app.id}
                                >
                                    {loadingId === app.id && app.targetStatus === 'RECHAZADO' ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span className="material-symbols-outlined fs-6">close</span>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicationsTable;
