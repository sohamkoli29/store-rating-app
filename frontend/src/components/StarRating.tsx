interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const StarRating = ({ value, onChange, disabled }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className={`text-lg leading-none ${star <= value ? "text-amber-500" : "text-slate-300"} disabled:cursor-not-allowed`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;