import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { CanvasFlipProvider } from './CanvasToolsContext';
import { EditCanvasToolsProvider } from './components/canvasTrimHooks/EditCanvasToolsContext';
import { SidebarStateProvider } from './components/sidebar/SidebarStateContext';
import { FileInputProvider } from './components/FileInput/FileInputContext';
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
								<FileInputProvider>
									<div className="app-container">
										<MenuBar />
										<div id="react-canvas">
												<CanvasInterface /> 
										</div>
									</div>
								</FileInputProvider>
							</SidebarStateProvider>
						</EditCanvasToolsProvider>
					</CanvasFlipProvider>
				</CanvasToolsProvider>
			</CanvasHistoryProvider>
    )
}

export default App
