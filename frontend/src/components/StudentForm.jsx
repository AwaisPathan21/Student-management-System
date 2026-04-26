import { useState, useEffect } from 'react';

const emptyForm = { rollno: '', name: '', email: '', phone: '', course: '', address: '' };

function StudentForm({ onSave, editingStudent, onCancelEdit, loading }) {
  const [form, setForm] = useState(emptyForm);

  // Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setForm({
        rollno: editingStudent.rollno || '',
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        course: editingStudent.course || '',
        address: editingStudent.address || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingStudent]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.rollno.trim() || !form.name.trim()) {
      alert('Roll number and name are required.');
      return;
    }
    onSave(form, editingStudent?._id);
    setForm(emptyForm);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    onCancelEdit();
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">{editingStudent ? '✏️ Edit Student' : '➕ Add Student'}</h5>
      <div className="row g-2">
        {[
          { name: 'rollno', placeholder: 'Roll No *', type: 'text' },
          { name: 'name', placeholder: 'Full Name *', type: 'text' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'phone', placeholder: 'Phone', type: 'text' },
          { name: 'course', placeholder: 'Course', type: 'text' },
          { name: 'address', placeholder: 'Address', type: 'text' },
        ].map((field) => (
          <div className="col-md-4" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              className="form-control"
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-success" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving…' : editingStudent ? 'Update Student' : 'Add Student'}
        </button>
        {editingStudent && (
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentForm;
