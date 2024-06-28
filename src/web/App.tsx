import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { GuideBarHiddenProvider } from './components/GuideBar/GuideBarHiddenContext';
import { EditCanvasToolsProvider } from './hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { SidebarStateProvider } from './components/SideBar/SidebarStateContext';
import { FileInputProvider } from './components/FileInput/FileInputContext';
import { ModalWindowProvider } from './components/ModalWindow/ModalWindowContext';
import {
    MenuBar,
} from './components';
import CanvasInterface from './CanvasInterface';
import './Home.css';

const App = (): JSX.Element => {
    return (
			<CanvasHistoryProvider>
				<CanvasToolsProvider>
					<GuideBarHiddenProvider>
						<EditCanvasToolsProvider>
							<SidebarStateProvider>
								<FileInputProvider>
									<ModalWindowProvider>
										<div className="app-container">
											<MenuBar />
											<div id="react-canvas">
												<CanvasInterface /> 
											</div>
										</div>
									</ModalWindowProvider>
								</FileInputProvider>
							</SidebarStateProvider>
						</EditCanvasToolsProvider>
					</GuideBarHiddenProvider>
				</CanvasToolsProvider>
			</CanvasHistoryProvider>
    )
}

export default App
