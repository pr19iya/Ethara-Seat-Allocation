interface Props {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function ProjectPagination({
  page,
  total,
  limit,
  onChange,
}: Props) {
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">
        Page {page} of {pages} · {total} projects
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}