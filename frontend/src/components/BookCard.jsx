import { useState } from "react";
import { Book } from "lucide-react";

function BookCard({ book, onEdit, onDelete }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isOut = book.quantity === 0;
  const isLow = book.quantity < 2;

  return (
    <div className={isLow ? "book-card low" : "book-card"}>
      <div className="cover">
        {book.cover_url && !imageFailed ? (
          <img
            src={book.cover_url}
            alt={book.title}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Book size={44} />
        )}
      </div>

      <h3>{book.title}</h3>
      <p className="muted">{book.author}</p>
      <p className="muted small">{book.genre}</p>

      <div className="card-foot">
        <span className={isOut ? "badge badge-out" : "badge badge-ok"}>
          {isOut ? "Checked Out" : "Available"}
        </span>
        {isLow && !isOut && <span className="badge badge-low">Low stock</span>}
        <span className="muted small">Qty: {book.quantity}</span>
      </div>

      {onEdit && (
        <div className="card-actions">
          <button className="btn btn-gold btn-small" onClick={() => onEdit(book)}>
            Update
          </button>
          <button className="btn btn-outline btn-small" onClick={() => onDelete(book.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BookCard;