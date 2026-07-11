interface Props {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function EmployeePagination({
  page,
  total,
  limit,
  onChange,
}: Props) {
  const pages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center mt-6 gap-3">

      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="border px-4 py-2 rounded"
      >
        Previous
      </button>

      <span className="font-semibold">
        {page} / {pages}
      </span>

      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="border px-4 py-2 rounded"
      >
        Next
      </button>

    </div>
  );
}