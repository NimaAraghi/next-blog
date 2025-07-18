import React from "react";

export default function Spinner() {
  return (
    <div className='flex justify-center items-center p-10'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
    </div>
  );
}
