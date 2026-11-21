"use client";

import { useRef, useState, type FormEvent } from "react";

type Status = "ready" | "saving" | "saved" | "error";

export default function AttendancePage() {
  const submitting = useRef(false);
  const [status, setStatus] = useState<Status>("ready");
  const [message, setMessage] = useState("");

  async function submitAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    submitting.current = true;
    setStatus("saving");
    setMessage("Saving your check-in…");

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), address: data.get("address") }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null;
        setStatus("error");
        setMessage(error?.message ?? "Couldn’t save your check-in. Please try again.");
        return;
      }

      form.reset();
      setStatus("saved");
      setMessage("You’re checked in.");
    } catch {
      setStatus("error");
      setMessage("The connection was interrupted. Please check your internet and try again.");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <main>
      <section className="card" aria-labelledby="title">
        <h1 id="title">Attendance check-in</h1>
        {status !== "saved" && (
          <form onSubmit={submitAttendance}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" maxLength={150} required disabled={status === "saving"} />
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" autoComplete="street-address" maxLength={500} required disabled={status === "saving"} />
            </div>
            <button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
        <p className="status" data-status={status} role="status">{message}</p>
      </section>
    </main>
  );
}
