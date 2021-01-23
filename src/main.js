const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//Manejo(crear/eliminar) de los atajos en windows cuando se instala o desinstala
if (require('electron-squirrel-startup')) { // eslint-disable-line 
  app.quit();
}

let mainWindow;
let difWindow;


/********* FUNCIONES PARA CREAR VENTANAS *********/
//Ventana principal
function mainWin() {
  mainWindow = new BrowserWindow({
    width: 910,
    height: 630,
    show: false,
    minHeight: 727,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};
//Ventana para mostrar diferencias
function difWin() {
  difWindow = new BrowserWindow({
    width: 800,
    height: 640,
    parent: mainWindow,
    modal: true,
    show: false,
    minHeight: 660,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  difWindow.loadFile(path.join(__dirname, "diferencias.html"));
};

/********* CICLO DE VIDA DE LA APLICACION *********/
//La app ha terminado de inicializarse
app.on('ready', () => {
  mainWin();
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
});

//Se han cerrado todas las ventanas de la app
app.on('window-all-closed', () => {
  app.quit();
});

/********* COMUNICACION CON LOS PROCESOS *********/
ipcMain.on("continuar", (e, arg) => {
  difWin();
  difWindow.on("ready-to-show", () => {
    difWindow.show();
  });

  //IMPORTANTE(si no no sirve BrowserWindow.fromId())
  let winDifId = difWindow.id;

  difWindow.webContents.on('did-finish-load', () => {
    //Se envia al proceso renderer
    difWindow.webContents.send('textoDiffs', arg, winDifId)

    ipcMain.on("finalizado", ()=>{
      difWindow.destroy();
    })
  })
})
