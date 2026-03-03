import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import { Link } from 'react-router-dom';
import UserEditModal from './UserEditModal';
import CommonPagination from './CommonPagination';

function AdminUsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Search & Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadUsers();
    }, [debouncedSearch, page]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers({
                search: debouncedSearch,
                page: page,
                per_page: 15
            });

            // Laravel Resource collection returns data in 'data' and pagination in 'meta'
            if (response.meta) {
                setUsers(response.data || []);
                setPagination(response.meta);
            } else {
                // Fallback for non-resource responses
                setUsers(response.data || response || []);
                setPagination(null);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

        try {
            await userService.deleteUser(id);
            loadUsers(); // Reload to keep pagination sync
        } catch (err) {
            console.error(err);
            alert('Error al eliminar usuario');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleUpdate = () => {
        loadUsers(); // Reload list to reflect changes
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-4">
                <div className="input-group-premium p-1 pe-3">
                    <span className="material-symbols-outlined ms-3 text-muted">search</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-link text-muted p-0" onClick={() => setSearchTerm('')}>
                            <span className="material-symbols-outlined fs-5">close</span>
                        </button>
                    )}
                </div>
            </div>

            {loading && !users.length ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : error ? (
                <div className="alert alert-danger border-0 shadow-sm rounded-4">{error}</div>
            ) : (
                <>
                    <div className="table-responsive card-premium border-0 shadow-sm rounded-4 overflow-hidden">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr className="text-muted small text-uppercase">
                                    <th className="ps-4 py-3">ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="ps-4 fw-bold text-muted">#{user.id}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{user.nombre}</div>
                                            </td>
                                            <td className="text-muted">{user.email}</td>
                                            <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">{user.rol}</span></td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${user.estado === 'ACTIVO' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'}`}>
                                                    {user.estado}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Link to={`/perfil/${user.id}`} className="btn btn-sm btn-light border-0" title="Ver Perfil">
                                                        <span className="material-symbols-outlined fs-5">visibility</span>
                                                    </Link>
                                                    <button type="button" className="btn btn-sm btn-light border-0" onClick={() => handleEdit(user)} title="Editar">
                                                        <span className="material-symbols-outlined fs-5">edit</span>
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-light text-danger border-0" onClick={() => handleDelete(user.id)} title="Eliminar">
                                                        <span className="material-symbols-outlined fs-5">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No se encontraron usuarios que coincidan con la búsqueda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <CommonPagination
                        pagination={pagination}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>
            )}

            <UserEditModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                user={editingUser}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default AdminUsersTable;
