"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-8 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">
          Ethara Workspace
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
          Seat Allocation Management
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white shadow-md">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              HR Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}