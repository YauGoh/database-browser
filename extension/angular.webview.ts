import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";

export class AngularWebview {

    private  panel:vscode.WebviewPanel;
    
    constructor(
            title:string,
            private htmlFilename: string, 
            private column: vscode.ViewColumn, 
            private context: vscode.ExtensionContext) {

        const dist = vscode.Uri.file(path.join(context.extensionPath, "dist"));

        const options : vscode.WebviewOptions = {
            enableScripts: true,

            localResourceRoots: [dist]
        }

        this.panel = vscode.window.createWebviewPanel(
            "angular", 
            title, 
            column,
            options);

        this.panel.webview.html = this.getHtml();
    }

    public reveal = () => {
        this.panel.reveal(this.column);
    }

    private getHtml = ():string => {

        const dist = vscode.Uri.file(
            path.join(
                this.context.extensionPath, 
                "dist"));

        const baseUri = this.panel.webview.asWebviewUri(dist);

        const htmlFile = 
            path.join(
                this.context.extensionPath, 
                "dist",
                this.htmlFilename);

        const html = fs
            .readFileSync(htmlFile, { encoding: "utf8" })
            .replace('<base href="/"', `<base href="${String(baseUri)}/"`)

        return html;
    }
}