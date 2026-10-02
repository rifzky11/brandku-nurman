import React from "react";
import Card from "./Card";

const CardGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data && data.length > 0 ? (
        data.map((item) => (
          <Card
            key={item.id}
            icon={item.icon || "✨"}
            title={item.title || item.name}
            subtitle={item.subtitle || item.description}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-slate-500">
          Tidak ada data fitur yang tersedia.
        </p>
      )}
    </div>
  );
};

export default CardGrid;