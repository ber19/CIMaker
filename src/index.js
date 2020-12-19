const { BrowserWindow, dialog, Menu } = require("electron").remote
const { ipcRenderer, clipboard, shell } = require("electron");
const fs = require("fs");
const diferencias = require("./modules/diff.js")
const clipboardListener = require("clipboard-event");
const JSZip = require("jszip");

/********* CONFIGURACION DE CODEMIRROR *********/
//Definicion de variables globales
let dv, original, final;
let flagOriginal = true, flagFinal = true;
let flagClipOrig = false, flagClipFin = false;
let textoOriginal = "";
let textoFinal = "";
let lockList = false;
let parentWin;
let menu;

//Ejecucion de la funcion para crear CodeMirror
initUI();
//Configuracion de las ventanas CodeMirror merge
original.setOption("viewportMargin", Infinity);
original.setOption("dragDrop", false);
original.setOption("readOnly", true);
final.setOption("viewportMargin", Infinity);
final.setOption("dragDrop", false);
final.setOption("readOnly", true);

//Funcion para crear la ventana CodeMirror (merge)
function initUI() {
    let target = document.getElementById("miCM");
    dv = CodeMirror.MergeView(target, {
        value: "",
        origRight: "",
        lineNumbers: true,
        allowDropFileTypes: ["text/plain"],
        connect: "align"
    });
    original = dv.editor();
    final = dv.rightOriginal();
}

/********* Funcionamiento de la aplicacion Electron *********/
/** Configuracion de los botones */
window.onload = function () {
    let filename1 = "";
    let filename2 = "";
    parentWin = BrowserWindow.fromId(1);

    //Se escucha el clipboard
    clipboardListener.startListening();

    document.getElementById("limpiar").addEventListener("click", () => {
        original.setValue("");
        original.clearHistory();
        final.setValue("");
        final.clearHistory();
        if (lockList) {
            clipboardListener.startListening();
        };
        lockList = false;
        flagOriginal = true;
        flagFinal = true;
        flagClipOrig = false;
        flagClipFin = false;
        textoOriginal = "";
        textoFinal = "";
        document.getElementById("file1").style.visibility = "visible";
        document.getElementById("file2").style.visibility = "visible";
        document.getElementById("continuar").style.visibility = "hidden";
    });
    document.getElementById("continuar").addEventListener("click", () => {
        //Contiene un string con las diferencias entre los dos archivos
        let textoDiff = diferencias.diffs(dv);
        let obj = {
            filenameOriginal: filename1,
            filenameFinal: filename2,
            textoDiff: textoDiff,
            textoOriginal: textoOriginal,
            textoFinal: textoFinal,
            flagClipOrig: flagClipOrig,
            flagClipFin: flagClipFin
        }
        ipcRenderer.send("continuar", obj);
    });
    document.getElementById("file1").addEventListener("click", () => {
        let parentWin = BrowserWindow.fromId(1);
        let file1 = dialog.showOpenDialogSync(parentWin, {
            title: "Selecciona archivo inicial",
            filters: [
                { name: "Texto", extensions: ["txt"] }
            ]
        })
        if (file1 != undefined) {
            filename1 = file1[0].split("\\");
            filename1 = filename1[filename1.length - 1];

            fs.readFile(file1[0], "utf-8", (err, data) => {
                original.setValue(data);
                textoOriginal = data;
            });
        } else { };
    })
    document.getElementById("file2").addEventListener("click", () => {
        let parentWin = BrowserWindow.fromId(1);
        let file2 = dialog.showOpenDialogSync(parentWin, {
            title: "Selecciona archivo final",
            filters: [
                { name: "Texto", extensions: ["txt"] }
            ]
        })
        if (file2 != undefined) {
            filename2 = file2[0].split("\\");
            filename2 = filename2[filename2.length - 1];

            fs.readFile(file2[0], "utf-8", (err, data) => {
                final.setValue(data);
                textoFinal = data;
            })
        } else { }
    })

    /********* Menu de mainWindow **********/
    //Funciones
    let mainA1 = function () {
        let ruta = dialog.showSaveDialogSync(parentWin, {
            title: "Guardar como...",
            filters: [
                { name: "texto", extensions: ["txt"] }
            ]
        });
        fs.writeFile(ruta, textoOriginal, function (err) {
            if (err) throw err;
        });
    };
    let mainA2 = function () {
        let ruta = dialog.showSaveDialogSync(parentWin, {
            title: "Guardar como...",
            filters: [
                { name: "texto", extensions: ["txt"] }
            ]
        });
        fs.writeFile(ruta, textoFinal, function (err) {
            if (err) throw err;
        });
    };
    let mainA3 = function () {
        let ruta = dialog.showSaveDialogSync(parentWin, {
            title: "Guardar como...",
            filters: [
                { name: "zip", extensions: ["zip"] }
            ]
        });
        let zip = new JSZip();
        if (filename1 != "") {
            zip.file(`${filename1}_(Inicial)`, textoOriginal);
        } else {
            zip.file("Inicial.txt", textoOriginal);
        }
        if (filename2 != "") {
            zip.file(`${filename2}_(Final)`, textoFinal);
        } else {
            zip.file("Final.txt", textoFinal);
        }
        zip.generateAsync({ type: "nodebuffer" })
            .then((contenido) => {
                fs.writeFileSync(ruta, contenido, (err) => {
                    if (err) throw err;
                });
            })
    }
    let mainE1 = function () {
        clipboard.writeText(textoOriginal);
    }
    let mainE2 = function () {
        clipboard.writeText(textoFinal);
    }
    let mainE3 = function () {
        original.setValue("");
        original.clearHistory();
        final.setValue("");
        final.clearHistory();
        if (lockList) {
            clipboardListener.startListening();
        };
        lockList = false;
        flagOriginal = true;
        flagFinal = true;
        flagClipOrig = false;
        flagClipFin = false;
        textoOriginal = "";
        textoFinal = "";
        document.getElementById("file1").style.visibility = "visible";
        document.getElementById("file2").style.visibility = "visible";
        document.getElementById("continuar").style.visibility = "hidden";
    }
    let mainH1 = function(){
        shell.openExternal("https://github.com/ber19/CIMaker.git")
    }
    let versiones = `Hecho con tecnologias:\n\n`+`nodejs: ${process.versions.node}\n`+
    `Electron: ${process.versions.electron}\n`+
        `CodeMirror: 5.58.3\n` +`icono: https://creativemarket.com/eucalyp\n\n`+
        `Muchas gracias!!!     2020 Bernardo Flores`
    let mainH2 = function(){
        dialog.showMessageBox(parentWin, {
            type: "info",
            buttons: ["Ok"],
            title: "CIMaker",
            message: "CIMaker:",
            detail: versiones
        })
    }

    //Objeto con las funciones para el menu
    const mainMenu = require("./modules/menu.js").mainMenu;
    let packMenu = {
        mainA1: mainA1,
        mainA2: mainA2,
        mainA3: mainA3,
        mainE1: mainE1,
        mainE2: mainE2,
        mainE3: mainE3,
        mainH1: mainH1,
        mainH2: mainH2
    }

    //Configuracion del menu para la ventana
    const tempMenuMain = mainMenu(parentWin, packMenu);
    menu = Menu.buildFromTemplate(tempMenuMain)
    parentWin.setMenu(menu);

    //Eventos de la ventana para el menu
    parentWin.on("maximize", () => {
        let maximizar = menu.getMenuItemById(3.3);
        maximizar.visible = false;
    })
    parentWin.on("unmaximize", () => {
        let maximizar = menu.getMenuItemById(3.3);
        maximizar.visible = true;
    })
};


/********* CLIPBOARD *********/
//Se escuchan cambios en el clipboard
clipboardListener.on("change", () => {
    let clipb = clipboard.readText("clipboard");
    if (flagOriginal && flagFinal) {
        textoOriginal = clipb;
        original.setValue(textoOriginal);
        flagClipOrig = true;
    }
    else if (!flagOriginal && flagFinal) {
        textoFinal = clipb;
        final.setValue(textoFinal);
        clipboardListener.stopListening();
        lockList = true;
        flagClipFin = true;
    }
    else if (flagOriginal && !flagFinal) {
        textoOriginal = clipb;
        original.setValue(textoOriginal);
        clipboardListener.stopListening();
        lockList = true;
        flagClipOrig = true;
    }
    else {
        if (!flagOriginal && !flagFinal) {
            clipboardListener.stopListening();
            lockList = true;
        }
    }
})


/********* Eventos CodeMirror  *********/
original.on("change", () => {
    document.getElementById("file1").style.visibility = "hidden";
    flagOriginal = false;
    if (final.getValue().length != 0) {
        document.getElementById("continuar").style.visibility = "visible";
    }
})
final.on("change", () => {
    document.getElementById("file2").style.visibility = "hidden";
    flagFinal = false;
    if (original.getValue().length != 0) {
        document.getElementById("continuar").style.visibility = "visible";
    }
})