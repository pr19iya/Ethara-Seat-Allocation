"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  Armchair,
  CheckCircle2,
  CircleAlert,
  ShieldCheck,
  Sofa,
  X,
} from "lucide-react";

import AllocationDrawer from "@/components/allocation/AllocationDrawer";
import FloorMap from "@/components/allocation/FloorMap";
import FloorSelector from "@/components/allocation/FloorSelector";
import SeatLegend from "@/components/allocation/SeatLegend";

import {
  allocateSeat,
  getAllocationFloors,
  getFloorSeatMap,
  searchAvailableEmployees,
} from "@/services/allocationService";

import {
  AvailableEmployee,
  FloorSeat,
  FloorSummary,
} from "@/types/allocation";

type SeatFilter =
  | "All"
  | "Available"
  | "Occupied"
  | "Reserved"
  | "Maintenance";

export default function AllocationPage() {
  const [floors, setFloors] = useState<
    FloorSummary[]
  >([]);

  const [selectedFloor, setSelectedFloor] =
    useState<number | null>(null);

  const [seats, setSeats] = useState<
    FloorSeat[]
  >([]);

  const [selectedSeat, setSelectedSeat] =
    useState<FloorSeat | null>(null);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<AvailableEmployee | null>(
    null
  );

  const [employeeSearch, setEmployeeSearch] =
    useState("");

  const [employees, setEmployees] = useState<
    AvailableEmployee[]
  >([]);

  const [loadingFloors, setLoadingFloors] =
    useState(true);

  const [loadingSeats, setLoadingSeats] =
    useState(false);

  const [
    searchingEmployees,
    setSearchingEmployees,
  ] = useState(false);

  const [allocating, setAllocating] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [seatFilter, setSeatFilter] =
    useState<SeatFilter>("All");

  const loadFloors = useCallback(async () => {
    try {
      setLoadingFloors(true);
      setError(null);

      const data =
        await getAllocationFloors();

      setFloors(data);

      setSelectedFloor((current) => {
        if (
          current !== null &&
          data.some(
            (item) =>
              item.floor === current
          )
        ) {
          return current;
        }

        const floorWithAvailability =
          data.find(
            (item) => item.available > 0
          );

        return (
          floorWithAvailability?.floor ??
          data[0]?.floor ??
          null
        );
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Unable to load floor information."
      );
    } finally {
      setLoadingFloors(false);
    }
  }, []);

  const loadSeats = useCallback(
    async (floor: number) => {
      try {
        setLoadingSeats(true);
        setError(null);

        const data =
          await getFloorSeatMap(floor);

        setSeats(data);
      } catch (requestError) {
        console.error(requestError);

        setSeats([]);

        setError(
          "Unable to load seats for this floor."
        );
      } finally {
        setLoadingSeats(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadFloors();
  }, [loadFloors]);

  useEffect(() => {
    if (selectedFloor === null) {
      return;
    }

    setSelectedSeat(null);
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setEmployees([]);
    setSeatFilter("All");

    void loadSeats(selectedFloor);
  }, [selectedFloor, loadSeats]);

  useEffect(() => {
    if (!selectedSeat) {
      return;
    }

    const timeout = window.setTimeout(
      async () => {
        try {
          setSearchingEmployees(true);

          const data =
            await searchAvailableEmployees(
              employeeSearch
            );

          setEmployees(data);
        } catch (requestError) {
          console.error(requestError);
          setEmployees([]);
        } finally {
          setSearchingEmployees(false);
        }
      },
      350
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [employeeSearch, selectedSeat]);

  /*
   * Automatically hide the success notification.
   */
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setMessage(null);
      },
      4000
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  /*
   * Automatically hide the error notification.
   */
  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setError(null);
      },
      6000
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [error]);

  const floorStats = useMemo(() => {
    return {
      total: seats.length,

      available: seats.filter(
        (seat) =>
          seat.status === "Available"
      ).length,

      occupied: seats.filter(
        (seat) =>
          seat.status === "Occupied"
      ).length,

      reserved: seats.filter(
        (seat) =>
          seat.status === "Reserved"
      ).length,

      maintenance: seats.filter(
        (seat) =>
          seat.status === "Maintenance"
      ).length,
    };
  }, [seats]);

  const filteredSeats = useMemo(() => {
    debugger
    if (seatFilter === "All") {
      return seats;
    }

    return seats.filter(
      (seat) =>
        seat.status === seatFilter
    );
  }, [seats, seatFilter]);

  function closeDrawer() {
    setSelectedSeat(null);
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setEmployees([]);
  }

  async function confirmAllocation() {
    if (
      !selectedSeat ||
      !selectedEmployee
    ) {
      return;
    }

    const allocatedSeat = selectedSeat;
    const allocatedEmployee =
      selectedEmployee;

    // Cache current state for rollback in case of API failure
    const previousSeats = seats;
    const previousFloors = floors;

    // Optimistically update only the selected seat locally
    setSeats((currentSeats) =>
      currentSeats.map((seat) =>
        seat.id === allocatedSeat.id
          ? {
            ...seat,
            status: "Occupied",
            employee: {
              id: allocatedEmployee.id,
              employee_code:
                allocatedEmployee.employee_code,
              name: allocatedEmployee.name,
              email:
                allocatedEmployee.email,
              role:
                allocatedEmployee.role,
              department:
                allocatedEmployee.department,
              project:
                allocatedEmployee.project,
            },
          }
          : seat
      )
    );

    // Optimistically update floor selector counts locally
    setFloors((currentFloors) =>
      currentFloors.map((floor) =>
        floor.floor ===
          allocatedSeat.floor
          ? {
            ...floor,
            available: Math.max(
              floor.available - 1,
              0
            ),
            occupied:
              floor.occupied + 1,
          }
          : floor
      )
    );

    // Close drawer immediately for a fast, real-time feel
    closeDrawer();

    try {
      setAllocating(true);
      setError(null);

      await allocateSeat({
        employee_id:
          allocatedEmployee.id,
        seat_id: allocatedSeat.id,
        project_id:
          allocatedEmployee.project_id,
      });

      setMessage(
        `Seat ${allocatedSeat.seat_number} allocated to ${allocatedEmployee.name} successfully.`
      );
    } catch (requestError) {
      console.error(requestError);

      // Rollback to previous state on failure
      setSeats(previousSeats);
      setFloors(previousFloors);

      if (
        axios.isAxiosError(
          requestError
        )
      ) {
        const detail =
          requestError.response?.data
            ?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Unable to allocate the selected seat."
        );
      } else {
        setError(
          "Unable to allocate the selected seat."
        );
      }
    } finally {
      setAllocating(false);
    }
  }

  if (loadingFloors) {
    return (
      <div className="surface-card p-10 text-center text-sm text-slate-500">
        Loading allocation workspace...
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Seat Allocation
          </h1>

          <p className="page-subtitle">
            Select a floor, choose an
            available seat, and assign it
            to an employee.
          </p>
        </div>
      </div>

      {/* Fixed success notification */}
      {message && (
        <div className="fixed bottom-6 right-6 z-[80] flex w-[calc(100%-3rem)] max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-2xl shadow-slate-300/50 sm:w-auto">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-emerald-900">
              Allocation successful
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessage(null)
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close success notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Fixed error notification */}
      {error && (
        <div className="fixed bottom-6 right-6 z-[80] flex w-[calc(100%-3rem)] max-w-md items-start gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 shadow-2xl shadow-slate-300/50 sm:w-auto">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <CircleAlert size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-rose-900">
              Something went wrong
            </p>

            <p className="mt-1 text-xs leading-5 text-rose-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close error notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <FloorSelector
        floors={floors}
        selectedFloor={selectedFloor}
        onSelect={(floor) => {
          setSelectedFloor(floor);
          setSeatFilter("All");
          setMessage(null);
          setError(null);
        }}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard
          label="Total Seats"
          value={floorStats.total}
          icon={Sofa}
          iconClass="bg-slate-100 text-slate-700"
        />

        <StatCard
          label="Available"
          value={floorStats.available}
          icon={Armchair}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          label="Occupied"
          value={floorStats.occupied}
          icon={Armchair}
          iconClass="bg-rose-50 text-rose-700"
        />

        <StatCard
          label="Reserved"
          value={floorStats.reserved}
          icon={ShieldCheck}
          iconClass="bg-amber-50 text-amber-700"
        />

        <StatCard
          label="Maintenance"
          value={
            floorStats.maintenance
          }
          icon={CircleAlert}
          iconClass="bg-slate-100 text-slate-600"
        />
      </div>

      <div className="surface-card space-y-4 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Floor {selectedFloor} Seat
              Map
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Filter seats by status and
              hover over a seat to view its
              details.
            </p>
          </div>

          <SeatLegend />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <SeatFilterButton
            label="All Seats"
            count={floorStats.total}
            active={
              seatFilter === "All"
            }
            onClick={() =>
              setSeatFilter("All")
            }
            activeClass="border-indigo-600 bg-indigo-600 text-white"
          />

          <SeatFilterButton
            label="Available"
            count={floorStats.available}
            active={
              seatFilter === "Available"
            }
            onClick={() =>
              setSeatFilter("Available")
            }
            activeClass="border-emerald-600 bg-emerald-600 text-white"
          />

          <SeatFilterButton
            label="Occupied"
            count={floorStats.occupied}
            active={
              seatFilter === "Occupied"
            }
            onClick={() =>
              setSeatFilter("Occupied")
            }
            activeClass="border-rose-600 bg-rose-600 text-white"
          />

          <SeatFilterButton
            label="Reserved"
            count={floorStats.reserved}
            active={
              seatFilter === "Reserved"
            }
            onClick={() =>
              setSeatFilter("Reserved")
            }
            activeClass="border-amber-500 bg-amber-500 text-white"
          />

          <SeatFilterButton
            label="Maintenance"
            count={
              floorStats.maintenance
            }
            active={
              seatFilter ===
              "Maintenance"
            }
            onClick={() =>
              setSeatFilter(
                "Maintenance"
              )
            }
            activeClass="border-slate-600 bg-slate-600 text-white"
          />
        </div>
      </div>

      {loadingSeats ? (
        <div className="surface-card p-12 text-center text-sm text-slate-500">
          Loading floor map...
        </div>
      ) : filteredSeats.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No{" "}
            {seatFilter === "All"
              ? ""
              : seatFilter.toLowerCase()}{" "}
            seats found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {seatFilter === "All"
              ? "This floor does not currently contain any seats."
              : `This floor does not contain any ${seatFilter.toLowerCase()} seats.`}
          </p>

          {seatFilter !== "All" && (
            <button
              type="button"
              onClick={() =>
                setSeatFilter("All")
              }
              className="secondary-button mt-4"
            >
              Show All Seats
            </button>
          )}
        </div>
      ) : (
        <FloorMap
          seats={filteredSeats}
          selectedSeat={selectedSeat}
          onSeatSelect={(seat) => {
            if (
              seat.status !== "Available"
            ) {
              return;
            }

            setSelectedSeat(seat);
            setSelectedEmployee(null);
            setEmployeeSearch("");
            setEmployees([]);
            setMessage(null);
            setError(null);
          }}
        />
      )}

      <AllocationDrawer
        seat={selectedSeat}
        search={employeeSearch}
        employees={employees}
        selectedEmployee={
          selectedEmployee
        }
        searching={
          searchingEmployees
        }
        allocating={allocating}
        onSearchChange={(value) => {
          setEmployeeSearch(value);
          setSelectedEmployee(null);
        }}
        onEmployeeSelect={
          setSelectedEmployee
        }
        onClose={closeDrawer}
        onConfirm={() => {
          void confirmAllocation();
        }}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
  }>;
  iconClass: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: StatCardProps) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <div
        className={`rounded-xl p-2.5 ${iconClass}`}
      >
        <Icon size={18} />
      </div>

      <div>
        <p className="text-[11px] font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 text-xl font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

interface SeatFilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  activeClass: string;
}

function SeatFilterButton({
  label,
  count,
  active,
  onClick,
  activeClass,
}: SeatFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${active
          ? activeClass
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
        }`}
    >
      <span>{label}</span>

      <span
        className={`rounded-full px-2 py-0.5 text-[10px] ${active
            ? "bg-white/20 text-white"
            : "bg-slate-100 text-slate-500"
          }`}
      >
        {count}
      </span>
    </button>
  );
}