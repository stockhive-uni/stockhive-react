import React from "react";

export default function Home() {
  return(
    <div className="h-screen flex items-center justify-center">
      <div>
      <h1 className="text-center text-6xl text-white font-extrabold">Stockhive</h1>
      <p className="text-center my-8"><a className="rounded-lg py-2 px-4 font-bold text-white bg-accent text-3xl hover:scale-105 hover:opacity-55 transition-all" href="/login">Login</a></p>
      </div>
    </div>
  );
}