/**
 * index.ts
 * Created on 2017/七月/09
 *
 * Author:
 *      "SONIC3D <sonic3d@gmail.com>"
 *
 * Copyright (c) 2017 "SONIC3D <sonic3d@gmail.com>"
 */
import { GDITrack, GDIDisc, GeneralGDIWriter } from "./gdi-parser";

module app {
    export class MainEntry {
        public static create(inputGdi: string, outputMode: number, outputDir: string): MainEntry {
            let retVal: MainEntry = new MainEntry();
            if ((!retVal) || (!retVal.init(inputGdi, outputMode, outputDir))) {
                retVal = undefined;
            }
            return retVal;
        }

        protected m_inputGdi: string;
        protected m_outputDir: string;
        protected m_outputMode: number;

        constructor() {
            console.log("MainEntry created!");
        }

        public init(inputGdi: string, outputMode: number, outputDir: string): boolean {
            if (outputMode != 0) {  // 0 for general gdi writer, 1 for redump gdi writer
                return false;
            }
            this.m_inputGdi = inputGdi;
            this.m_outputDir = outputDir;
            this.m_outputMode = outputMode;
            return true;
        }

        public exec(): void {
            // TODO: Program entry logic
            console.log("MainEntry::exec()");
            GDIDisc.createFromFile(this.m_inputGdi, (gdiLayout: GDIDisc) => {
                console.log("GDI file parsing finished.");

                gdiLayout.printInfo();
                gdiLayout.printIpBinInfo();
                if (gdiLayout.isIpBinLoaded) {
                    let writer = GeneralGDIWriter.create(gdiLayout, this.m_outputDir);
                    writer.exec();
                }
                gdiLayout.unload();
            });
        }
    }
}

console.log("Program started!");
let args:string[] = process.argv.slice(2);
console.log('Commandline arguments: ', args);
if (args.length != 3) {
    // TODO: print help
} else {
    let inputGdiFile: string = args[0];
    let outputMode: number = parseInt(args[1]);
    let outputDir: string = args[2];
    let instance = app.MainEntry.create(inputGdiFile, outputMode, outputDir);
    if (instance) {
        instance.exec();
    }
}
console.log("Program exit!");
