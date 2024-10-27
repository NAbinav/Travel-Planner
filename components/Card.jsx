import React from "react";

const Card = ({ input, text, onInputChange }) => {
  return (
    <div className="flex justify-between w-1/2  h-16">
      <p className="self-center">{text}</p>
      <input
        type="text"
        placeholder={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="border p-2 rounded-md"
      />
    </div>
  );
};

export default Card;
