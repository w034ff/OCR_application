import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { CanvasFlipProvider } from './CanvasToolsContext';
import { CanvasSaveStateProvider } from './CanvasSaveStateContext';
import { EditCanvasToolsProvider } from './hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { SidebarStateProvider } from './components/Sidebar/SidebarStateContext';
import { FileInputProvider } from './components/FileInput/FileInputContext';
import { CanvasModalWindowProvider } from './components/modalWindow/CanvasModalWindowContext';
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
						<CanvasSaveStateProvider>
							<EditCanvasToolsProvider>
								<SidebarStateProvider>
									<FileInputProvider>
										<CanvasModalWindowProvider>
											<div className="app-container">
												<MenuBar />
												<div id="react-canvas">
													<CanvasInterface /> 
												</div>
											</div>
										</CanvasModalWindowProvider>
									</FileInputProvider>
								</SidebarStateProvider>
							</EditCanvasToolsProvider>
						</CanvasSaveStateProvider>
					</CanvasFlipProvider>
				</CanvasToolsProvider>
			</CanvasHistoryProvider>
    )
}

export default App
