import React from "react";
import Image from "next/image";
import poster from "../../public/Qiskit Fall Fest Poster.png";
import { RiCloseFill } from "react-icons/ri";
const page = () => {
  return (
    <div className="flex flex-row text-3xl  justify-center ">
      <a href="/" className="absolute top-16">
        <RiCloseFill />
      </a>
      <div className="flex flex-row justify-center snap-center self-center items-center translate-y-24 ">
        <Image src={poster} width={400} alt="poster"></Image>
      </div>
    </div>
  );
};

export default page;
