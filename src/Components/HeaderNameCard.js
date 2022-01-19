import React from "react";
import { useDrag } from "react-dnd";
import "./HeaderNameCard.css";

export const HeaderNameCard = ({ id, name }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "pet",
    item: { id, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div className="headerNameCard" ref={dragRef}>
      {name}
      {isDragging && " ✔"}
    </div>
  );
};
