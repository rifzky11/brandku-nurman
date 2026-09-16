import React from "react";
import Card from "./Card";

const CardGrid = ({ data = [] }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <Card
          key={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
        />
      ))}
    </div>
  );
};

export default CardGrid;
