const { ipcRenderer, contextBridge, dialog } = require('electron');


contextBridge.exposeInMainWorld('ShowError', {
    sendMain: (title: string, message: string) => {
        ipcRenderer.send('show-error', title, message);
    }
});

type UnRedoCallback = (action: string, count: number ) => void
contextBridge.exposeInMainWorld('UnRedo', {
    sendUndoRedoAction: (payload: { action: string, count: number }) => 
        ipcRenderer.invoke('UnRedo-action', payload),
    on: (channel: string, func: UnRedoCallback) => {
        ipcRenderer.on(channel, (event, action, count) => func(action, count));
    },
    off: (channel: string, func: UnRedoCallback) => {
        ipcRenderer.removeListener(channel, func);
    }
});

contextBridge.exposeInMainWorld('InsertURL', {
    sendURL: (ImageURL: string) => {
        ipcRenderer.invoke('load-URL', ImageURL);
    },
    on: (channel: string, func: (ImageURL: string) => void) => {
        ipcRenderer.on(channel, (_, ImageURL: string) => func(ImageURL));
    },
    off: (channel: string, func: (ImageURL: string) => void) => {
        ipcRenderer.removeListener(channel, func);
    }
});
