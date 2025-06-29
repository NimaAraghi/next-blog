"use client";

import { useState } from "react";

export default function Test() {
  const [id, setId] = useState("");
  const [fetchResponse, setFetchResponse] = useState({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setFetchResponse(data);
    }

    setFetchResponse(data);
  }

  return (
    <div className='flex flex-col gap-10'>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setId(e.target.value)}
          value={id}
          type='text'
          className='border-white'
        />
        <button type='submit'>submit</button>
      </form>
      <div>{JSON.stringify(fetchResponse)}</div>
    </div>
  );
}
