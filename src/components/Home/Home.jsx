import React from 'react';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import Leftside from './Leftside';
import Maincontent from './Maincontent';
import Rightside from './Rightside';

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate(); // استدعاء useNavigate

  return (
    <div>
<div className="grid grid-cols-12 gap-4 p-4">
      <Leftside/>
     <Maincontent/>
     <Rightside/>
    </div>
    </div>
  )
}
