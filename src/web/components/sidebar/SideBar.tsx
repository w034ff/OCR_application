import React, { JSX, useEffect, useState } from 'react';
import './Sidebar.css';
import { useSidebarStateContext } from './SidebarStateContext';
import TrimSettingsForm from './TrimSettingsForm';
import ResizeCanvasForm from './ChangeCanvasSize';


const SideBar = (): JSX.Element | undefined => {
  const { trimModeActive } = useSidebarStateContext();

  if (trimModeActive) {
    return (
      <TrimSettingsForm />
    );
  } 
  else {
    return (
      <ResizeCanvasForm />
    );
  }
}

export default SideBar
