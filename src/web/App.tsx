import React, { JSX } from 'react';
import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { CanvasFlipProvider } from './CanvasToolsContext';
import { EditCanvasToolsProvider } from './components/canvasTrimHooks/EditCanvasToolsContext';
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
						<EditCanvasToolsProvider>
							<SidebarStateProvider>
								<div className="app-container">
									<MenuBar />
									<div id="react-canvas">
											<CanvasInterface /> 
									</div>
								</div>
							</SidebarStateProvider>
						</EditCanvasToolsProvider>
					</CanvasFlipProvider>
				</CanvasToolsProvider>
			</CanvasHistoryProvider>
    )
}

export default App
