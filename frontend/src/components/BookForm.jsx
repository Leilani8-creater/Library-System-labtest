import { useState, useEffect } from "react";

const emptyBook = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  quantity: "",
  cover_url: "",
};

function BookForm({ initialBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyBook);
  const [errors, setErrors] = useState({});

  // When a book is chosen for updating, fill the form with its details
  useEffect(() => {
    if (initialBook) {
      setForm({
        title: initialBook.title,
        author: initialBook.author,
        genre: initialBook.genre ?? "",
        isbn: initialBook.isbn ?? "",
        quantity: initialBook.quantity,
        cover_url: initialBook.cover_url ?? "",
      });
    } else {
      setForm(emptyBook);
    }
    setErrors({});
  }, [initialBook]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function fillCover() {
    if (form.isbn.trim() === "") {
      setErrors({ ...errors, isbn: "Enter the ISBN first" });
      return;
    }
    const cleanIsbn = form.isbn.replace(/-/g, "");
    setForm({
      ...form,
      cover_url: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg?default=false`,
    });
  }

  function validate() {
    const newErrors = {};
    if (form.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    if (form.author.trim() === "") {
      newErrors.author = "Author is required";
    }
    if (form.isbn !== "" && !/^[0-9-]{10,17}$/.test(form.isbn)) {
      newErrors.isbn = "ISBN must be 10 to 13 digits";
    }
    if (form.quantity === "") {
      newErrors.quantity = "Quantity is required";
    } else if (Number(form.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit({ ...form, quantity: Number(form.quantity) });
    if (!initialBook) {
      setForm(emptyBook);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div className="field">
          <label>Author</label>
          <input name="author" value={form.author} onChange={handleChange} />
          {errors.author && <p className="error-text">{errors.author}</p>}
        </div>

        <div className="field">
          <label>Genre</label>
          <input name="genre" value={form.genre} onChange={handleChange} />
        </div>

        <div className="field">
          <label>ISBN</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} />
          {errors.isbn && <p className="error-text">{errors.isbn}</p>}
        </div>

        <div className="field">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="error-text">{errors.quantity}</p>}
        </div>

        <div className="field">
          <label>Cover image link</label>
          <input name="cover_url" value={form.cover_url} onChange={handleChange} />
          <button
            type="button"
            className="btn btn-grey btn-small"
            style={{ marginTop: 8 }}
            onClick={fillCover}
          >
            Get cover from ISBN
          </button>
          {form.cover_url !== "" && (
            <img className="cover-preview" src={form.cover_url} alt="Cover preview" />
          )}
        </div>
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">
          {initialBook ? "Save changes" : "Add book"}
        </button>
        {initialBook && (
          <button className="btn btn-grey" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;