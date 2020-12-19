/******** Menu para la ventana principal ********/
let mainMenu = (ventana, packMenu) => {
    return templateMenu = [
        {
            id: 1,
            label: "Archivo",
            submenu: [
                {   id: 1.1,
                    label: "Obtener inicial como .txt",
                    click(){
                        packMenu.mainA1();
                    }
                },
                {
                    id: 1.2,
                    label: "Obtener final como .txt",
                    click() {
                        packMenu.mainA2();
                    }
                },
                {
                    id: 1.3,
                    label: "Obtener comprimido con inicial y final",
                    click() {
                        packMenu.mainA3();
                    }
                },
                {
                    id: 1.4,
                    label: "Salir del programa",
                    role: "quit"
                }
            ]
        },
        {
            id: 2,
            label: "Editar",
            submenu: [
                {
                    id: 2.1,
                    label: "Obtener texto inicial (en el clipboard)",
                    accelerator: "Ctrl+Shift+1",
                    click(){
                        packMenu.mainE1();
                    }
                },
                {
                    id: 2.2,
                    label: "Obtener texto final (en el clipboard)",
                    accelerator: "Ctrl+Shift+2",
                    click(){
                        packMenu.mainE2();
                    }
                },
                {
                    id: 2.3,
                    label: "Limpiar todo",
                    accelerator: "Ctrl+Shift+L",
                    click(){
                        packMenu.mainE3();
                    }
                }
            ]
        },
        {
            id: 3,
            label: "Ventana",
            submenu: [
                {
                    id: 3.1,
                    label: "Centrar (tamaño normal)",
                    accelerator: "Ctrl+Shift+B",
                    click(){
                        ventana.restore();
                        ventana.center();
                        ventana.setSize(910, 620);
                    }
                },
                {
                    id: 3.2,
                    label: "Minimizar",
                    accelerator: "Ctrl+Shift+M",
                    click() {
                        ventana.minimize();
                    }
                },
                {
                    id: 3.3,
                    label: "Maximizar",
                    accelerator: "Ctrl+Shift+N",
                    click(){
                        ventana.maximize();
                    }
                }
            ]
        },
        {
            id: 4,
            label: "Ayuda",
            submenu: [
                {
                    id:4.1,
                    label: "Repositorio del programa",
                    click(){
                        packMenu.mainH1();
                    }
                },
                {
                    id:4.2,
                    label: "Acerca de ...",
                    click(){
                        packMenu.mainH2();
                    }
                }
            ]
        }//,
        // {
        //     label: "Dev",
        //     submenu: [
        //         { role: "toggledevtools"}
        //     ],
        // }
    ];
};

/******** Menu para la ventana de diferencias********/
let diffMenu = (ventana, packMenu) =>{
    return templateMenu = [
        {
            id: 1,
            label: "Archivo",
            submenu: [
                {
                    id: 1.1,
                    label: "Obtener como .txt",
                    click(){
                        packMenu.difA1();
                    }
                },
                {
                    id: 1.2,
                    label: "Salir del programa",
                    role: "quit"
                }
            ]
        },
        {
            id: 2,
            label: "Editar",
            submenu: [
                {
                    id: 2.1,
                    label: "Obtener texto (en el clipboard)",
                    accelerator: "Ctrl+Shift+C",
                    click(){
                        packMenu.difE1();
                    }
                }
            ]
        },
        {
            id: 3,
            label: "Ventana",
            submenu: [
                {
                    id: 3.1,
                    label: "Centrar (tamaño normal)",
                    accelerator: "Ctrl+Shift+B",
                    click(){
                        ventana.restore();
                        ventana.center();
                        ventana.setSize(800, 630);
                    }
                },
                {
                    id: 3.2,
                    label: "Minimizar (todo el programa)",
                    accelerator: "Ctrl+Shift+M", 
                    click(){
                        ventana.minimize();
                    }
                },
                {
                    id:3.3,
                    label: "Maximixar",
                    accelerator: "Ctrl+Shift+N",
                    click(){
                        ventana.maximize()
                    }
                }
            ]
        }//,
        // {
        //     label: "Dev",
        //     submenu: [
        //         { role: "toggledevtools" }
        //     ]
        // }
    ]
}

module.exports.mainMenu = mainMenu;
module.exports.diffMenu = diffMenu;