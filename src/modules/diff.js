let diffs = function( dv ){
    let original = dv.editor();
    let final = dv.rightOriginal();
    let arr = dv.rightChunks();

    let texto = "";

    for(let i=0; i<arr.length; i++){
        let obj = arr[i];
        let izqFrom = obj.editFrom;
        let izqTo = obj.editTo;
        let derFrom = obj.origFrom;
        let derTo = obj.origTo;
        let izqLineas = [];
        let derLineas = [];

        for(let j=izqFrom; j<izqTo; j++){
            let linea = original.getLine(j);
            izqLineas.push(linea);
        }

        for(let j=derFrom; j<derTo; j++){
            let linea = final.getLine(j);
            derLineas.push(linea);
        }

        if(izqLineas.length>derLineas.length){
            for(let k=0; k<izqLineas.length; k++){
                let izqLin = izqLineas[k];
                let derLin = derLineas[k];
                if(derLin!=undefined){
                    texto += `- ${izqLin}\n`;
                    texto += `+ ${derLin}\n`;
                }else{
                    texto += `- ${izqLin}\n`;
                }
            }
        }
        else if(derLineas.length>izqLineas.length){
            for(let k=0; k<derLineas.length; k++){
                let izqLin = izqLineas[k];
                let derLin = derLineas[k];
                if(izqLin!=undefined){
                    texto.concat("-", izqLin, "\n");
                    texto.concat("+", derLin, "\n")
                    texto += `- ${izqLin}\n`;
                    texto += `+ ${derLin}\n`;
                }else{
                    texto += `+ ${derLin}\n`
                }
            }
        }
        else{
            for(let k=0; k<izqLineas.length; k++){
                let izqLin = izqLineas[k];
                let derLin = derLineas[k];
                texto += `- ${izqLin}\n`;
                texto += `+ ${derLin}\n`;
            }
        }
        texto += `${"~".repeat(100)}\n`
    }
    return texto;
}

module.exports.diffs = diffs;