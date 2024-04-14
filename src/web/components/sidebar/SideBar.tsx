import React, { JSX, useEffect, useState } from 'react';
import './Sidebar.css';
import { useSidebarStateContext } from './SidebarStateContext';
import TrimSettingsForm from './TrimSettingsForm';
import ChangeCanvasSizeForm from './ChangeCanvasSize';


const SideBar = (): JSX.Element | undefined => {
  const { trimDetailsVisible } = useSidebarStateContext();

  if (trimDetailsVisible) {
    return (
      <TrimSettingsForm />
    );
  } 
  else {
    return (
      <ChangeCanvasSizeForm />
    );
  }
}

export default SideBar
