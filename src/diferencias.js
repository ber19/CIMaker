const { BrowserWindow, dialog, Menu, clipboard } = require("electron").remote
const { ipcRenderer } = require("electron");
const fs = require("fs");
const JSZip = require("jszip")

/********* CONFIGURACION DE CODEMIRROR *********/
let difs = CodeMirror.fromTextArea(document.getElementById("difs"), {
    lineNumbers: true,
    readOnly: true,
    viewportMargin: Infinity,
    mode: "diff",
    allowDropFileTypes: ["text/plain"],
});
difs.setSize(null, 550)

/********* DEFINICION DE VARIABLES GLOBALES *********/
let textoOriginal = "";
let textoFinal = "";
let filenameOriginal = "";
let filenameFinal = "";
let textoDiff = "";
let flagClipOrig = false;
let flagClipFin = false;
let parentWin;

/********* FUNCIONAMIENTO DE LA APLICACION ELECTRON *********/
/** Configuracion de los botones */
window.onload = function () {
    parentWin = BrowserWindow.fromId(2);

    document.getElementById("empaquetar").addEventListener("click", () => {
        let date = new Date();
        let ruta = dialog.showSaveDialogSync(parentWin, {
            title: "Guardar como...",
            defaultPath: `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}-${date.getHours()}_${date.getMinutes()}`,
            filters: [
                { name: "zip", extensions: ["zip"] }
            ]
        })
        let zip = new JSZip();
        if (flagClipOrig) {
            zip.file("Inicial(clipboard).txt", textoOriginal);
        } else {
            if (!flagClipOrig) {
                zip.file(filenameOriginal, textoOriginal);
            }
        }
        if (flagClipFin) {
            zip.file("Final(clipboard).txt", textoFinal);
        } else {
            if (!flagClipFin) {
                zip.file(filenameFinal, textoFinal);
            }
        }
        let difs = zip.folder("Diferencias");
        difs.file(`${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}-${date.getHours()}_${date.getMinutes()}.txt`, textoDiff);
        zip.generateAsync({ type: "nodebuffer" })
            .then((contenido) => {
                fs.writeFileSync(ruta, contenido, (err) => {
                    if (err) throw err;
                })
                let saved = dialog.showMessageBoxSync(parentWin, {
                    type: "info",
                    title: "Gracias...",
                    message: "El archivo comprimido se ha guardado"
                });
                if (saved == 0) {
                    ipcRenderer.send("finalizado");
                }
            })
    })
}

/********* COMUNICACION CON LOS PROCESOS *********/
ipcRenderer.on("textoDiffs", (e, arg, winId) => {
    parentWin = BrowserWindow.fromId(winId);

    filenameOriginal = arg.filenameOriginal;
    filenameFinal = arg.filenameFinal;
    textoDiff = arg.textoDiff;
    textoOriginal = arg.textoOriginal;
    textoFinal = arg.textoFinal;
    flagClipOrig = arg.flagClipOrig;
    flagClipFin = arg.flagClipFin;

    if (flagClipOrig && flagClipFin) {
        let value = `Textos:\n--- ${"Inicial (copiado del clipboard)"}\n+++ ${"Final (copiado del clipboard)"}\n\n${"~".repeat(100)}\n`;
        value += `${textoDiff}`
        textoDiff = value;
        difs.setValue(value);

    }
    else if (!flagClipOrig && flagClipFin) {
        let value = `Textos::\n--- ${filenameOriginal}\n+++ ${"Final (copiado del clipboard)"}\n\n${"~".repeat(100)}\n`;
        value += `${textoDiff}`
        textoDiff = value;
        difs.setValue(value);

    }
    else if (flagClipOrig && !flagClipFin) {
        let value = `Textos:\n--- ${"Inicial (copiado del clipboard)"}\n+++ ${filenameFinal}\n\n${"~".repeat(100)}\n`;
        value += `${textoDiff}`
        textoDiff = value;
        difs.setValue(value);

    }
    else {
        if (!flagClipOrig && !flagClipFin) {
            let value = `Archivos comparados:\n--- ${filenameOriginal}\n+++ ${filenameFinal}\n\n${"~".repeat(100)}\n`;
            value += `${textoDiff}`
            textoDiff = value;
            difs.setValue(value);
        }
    }

    /******** Menu de difWindow ********/
    //Funciones
    let difA1 = function () {
        let ruta = dialog.showSaveDialogSync(parentWin, {
            title: "Guardar como...",
            filters: [
                { name: "texto", extensions: ["txt"] }
            ]
        });
        fs.writeFile(ruta, textoDiff, function (err) {
            if (err) throw err;
        });
    }
    let difE1 = function () {
        clipboard.writeText(textoDiff);
    }

    //Objeto con las funciones para el menu
    const diffMenu = require("./modules/menu.js").diffMenu;
    let packMenu = {
        difA1: difA1,
        difE1: difE1
    }
    //Configuracion del menu para la ventana
    const tempMenuDiff = diffMenu(parentWin, packMenu);
    let menu = Menu.buildFromTemplate(tempMenuDiff);
    parentWin.setMenu(menu);

    //Eventos de la ventana para el menu
    parentWin.on("maximize", ()=>{
        let maximizar = menu.getMenuItemById(3.3);
        maximizar.visible = false;
    })
    parentWin.on("unmaximize", ()=>{
        let maximizar = menu.getMenuItemById(3.3);
        maximizar.visible = true;
    })
})

