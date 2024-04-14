import React from 'react';

export const handleUndoRedoAction = (action: string, count: number = 1) => {
    window.UnRedo.sendUndoRedoAction({ action, count });
};
