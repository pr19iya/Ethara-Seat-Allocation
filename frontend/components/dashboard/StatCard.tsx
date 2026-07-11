interface Props {
  title: string;
  value: number | string;
  color: string;
}

export default function StatCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 text-white ${color}`}
    >
      <h3 className="text-lg font-medium">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-4">
        {value}
      </p>
    </div>
  );
}