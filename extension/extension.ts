import * as vscode from "vscode";

import { AngularWebview } from "./angular.webview";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "helloworld" is now active!');
    let disposable = vscode.commands.registerCommand(
        "database-browser.start",
        () => {
            vscode.window.showInformationMessage(
                "Hello World from Helloworld!"
            );

            var view = new AngularWebview(
                "testing",
                "index.html",
                vscode.ViewColumn.One,
                context
            );

            view.reveal();
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
