import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const book = res.data.find((b) => b._id === id);
        if (book) {
          setTitle(book.title);
          setAuthor(book.author);
        } else {
          console.error('Book not found');
        }
      } catch (error) {
        console.error('Failed to fetch book:', error.response?.data?.msg || error.message);
      }
    };

    fetchBook();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/books/${id}`,
        { title, author },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/books');
    } catch (error) {
      console.error('Failed to update book:', error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Book</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book Title"
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Book</button>
      </form>
    </div>
  );
}

export default EditBook;
