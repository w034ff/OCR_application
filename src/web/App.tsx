import React, { JSX } from 'react';
import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { CanvasFlipProvider } from './CanvasToolsContext';
import { GuideBarToolsProvider } from './components/sidebar/GuideBarToolsContext';
import { SidebarStateProvider } from './components/sidebar/SidebarStateContext';
import {
    MenuBar,
} from './components';
import CanvasInterface from './CanvasInterface';
import './Home.css';

const App = (): JSX.Element => {
    return (
			<CanvasHistoryProvider>
				<CanvasToolsProvider>
					<CanvasFlipProvider>
						<GuideBarToolsProvider>
							<SidebarStateProvider>
								<div className="app-container">
									<MenuBar />
									<div id="react-canvas">
											<CanvasInterface /> 
									</div>
								</div>
							</SidebarStateProvider>
						</GuideBarToolsProvider>
					</CanvasFlipProvider>
				</CanvasToolsProvider>
			</CanvasHistoryProvider>
    )
}

export default App
