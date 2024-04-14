import insert from '../assets/icons/insert.png'
import undo from '../assets/icons/undo.png'
import redo from '../assets/icons/redo.png'
import history from '../assets/icons/history_icon.png'
import { handleUndoRedoAction } from './handlers'

export const endItems = [
  {
    icon: insert,
    text: '挿入',
  },
  {
    icon: undo,
    text: '元に戻す',
    onClick: () => handleUndoRedoAction('Undo', 1),
  },
  {
    icon: history,
    text: '履歴',
  },
  {
    icon: redo,
    text: 'やり直し',
    onClick: () => handleUndoRedoAction('Redo', 1),
  },
  {
    text: '閉じる',
  },
];
