import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Link } from 'react-router-dom';

function AdminUsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers();
            setUsers(response.data || []);
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
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
            alert('Error al eliminar usuario');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td><span className="badge bg-primary">{user.rol}</span></td>
                                <td><span className={`badge ${user.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}`}>{user.estado}</span></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/perfil/${user.id}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>visibility</span>
                                        </Link>
                                        <button 
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="text-center text-muted py-4">No hay usuarios</div>
            )}
        </div>
    );
}

export default AdminUsersTable;
