import RotateObjectIcon from '../assets/svgs/RotateObjectIcon';
import FlipObjectIcon from '../assets/svgs/FlipObjectIcon';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useEditCanvasToolsContext } from '../../hooks/editFabricCanvasHooks/EditCanvasToolsContext';

const RotateFlipButtons = (): JSX.Element => {
  const { toggleSaveState } = useSetHistoryStateContext()
  const { setRotate90, setFlipState } = useEditCanvasToolsContext();

	// キャンバスを反転・回転させるonClickイベント
  const handleRotateAndFlip = (setAction: React.Dispatch<React.SetStateAction<number>>, direction: number) => {
    setAction(prev => prev + direction);
    toggleSaveState(); // SaveStateを更新
  }

  return (
		<div className="horizontal-group four-buttons">
			<button onClick={() => handleRotateAndFlip(setRotate90, -1)}>
				<RotateObjectIcon className='button-icon' />
			</button>
			<button onClick={() => handleRotateAndFlip(setRotate90, +1)}>
				<RotateObjectIcon className='button-icon' style={{ transform: "scaleX(-1)" }} />
			</button>
			<button onClick={() => handleRotateAndFlip(setFlipState, -1)}>
				<FlipObjectIcon className='button-icon'/>
			</button>
			<button onClick={() => handleRotateAndFlip(setFlipState, +1)}>
				<FlipObjectIcon className='button-icon' style={{ transform: "rotate(270deg)" }} />
			</button>
		</div>
  );
}

export default RotateFlipButtons
