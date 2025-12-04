"use client";

import { useEffect, useRef } from "react";


const Calender = ({ onDateChange }) => {
  const myDatepicker = useRef(null);

  useEffect(() => {
    let picker = null;
    let isMounted = true;

    const init = async () => {
        if (typeof window === "undefined" || !myDatepicker.current) return;
      
        const module = await import("pikaday");
        const Pikaday = module.default || module;
      
        if (!isMounted || !myDatepicker.current) return;
      
        picker = new Pikaday({
            field: myDatepicker.current,
            onSelect: (date) => {
              if (onDateChange) {
                // Format date as YYYY-MM-DD
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onDateChange(`${year}-${month}-${day}`);
              }
            },
          });
      };

    init();

    return () => {
      isMounted = false;
      if (picker) {
        picker.destroy();
        picker = null;
      }
    };
  }, []);

  return (
    <>
      <label className="label text-black font-bold">Date</label>
      <input
        type="text"
        placeholder="Pick a date"
        className="input bg-white border-2 border-black pika-single"
        defaultValue="Pick a date"
        ref={myDatepicker}
      />
      
    </>
  );
};

export default Calender;