import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import StudentForm from '../components/StudentForm';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchStudents = useCallback(async (search = '') => {
    setLoadingStudents(true);
    setError('');
    try {
      const { data } = await getStudents(search);
      setStudents(data);
    } catch (err) {
      setError('Failed to load students. Is the server running?');
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSave = async (formData, id) => {
    setSavingStudent(true);
    setError('');
    try {
      if (id) {
        await updateStudent(id, formData);
        showSuccess('Student updated successfully!');
      } else {
        await createStudent(formData);
        showSuccess('Student added successfully!');
      }
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try {
      await deleteStudent(id);
      showSuccess('Student deleted.');
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onSearch={(q) => fetchStudents(q)} onCancelSearch={() => fetchStudents()} />

      <div className="container my-4 flex-grow-1">
        <h2 className="text-center mb-4">Student Management System</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}

        {/* Add / Edit Form */}
        <StudentForm
          onSave={handleSave}
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
          loading={savingStudent}
        />

        {/* Student Table */}
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">👩‍🎓 Students ({students.length})</h5>
          </div>

          {loadingStudents ? (
            <div className="spinner-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : students.length === 0 ? (
            <p className="text-muted text-center py-4">No students found. Add one above!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Address</th>
                    <th style={{ width: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.rollno}</td>
                      <td>{student.name}</td>
                      <td>{student.email || '—'}</td>
                      <td>{student.phone || '—'}</td>
                      <td>{student.course || '—'}</td>
                      <td>{student.address || '—'}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => setEditingStudent(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(student._id, student.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center p-3">
        <p className="mb-0">Sinhgad Institute of Business Administration And Research (SIBAR), Kondhwa</p>
        <p className="mb-0">Name: Awais Sadik Pathan | MCA | Roll No: 30</p>
      </footer>
    </div>
  );
}

export default Dashboard;
