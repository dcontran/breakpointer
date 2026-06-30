// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path from "path";
import * as vscode from "vscode";




function getAllGdbBreakpointCommands() : string[]{
    const breakpoints = vscode.debug.breakpoints;

    return breakpoints
    .filter((bp): bp is vscode.SourceBreakpoint => bp instanceof vscode.SourceBreakpoint)
    .map((bp)=>{
      const file = path.basename(bp.location.uri.fsPath);
      const line = bp.location.range.start.line +1;
      
      return `b ${file}:${line}`;
    });
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "breakpointer" is now active!',
    );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const copyCurrentLine = vscode.commands.registerCommand(
        "breakpointer.copyCurrentLine",
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return;
            }

            const document = editor.document;
            const position = editor.selection.active;

            const file = path.basename(document.fileName);

            const text = `${file}:${position.line}`;
            

            await vscode.env.clipboard.writeText(text);

            vscode.window.showInformationMessage("Copied line");
        },
    );




    const copyBreakpoints = vscode.commands.registerCommand(
        "breakpointer.copyBreakpoints",
        async () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return;
            }

            const gdbBreakpointCommands = getAllGdbBreakpointCommands();

            if (gdbBreakpointCommands.length===0){
            vscode.window.showInformationMessage("No breakpoints set");
            return;

            }

            const output = gdbBreakpointCommands.join("\n");
            await vscode.env.clipboard.writeText(output);
            vscode.window.showInformationMessage("Copied breakpoints as GDB commands");

           
        },
    );

    context.subscriptions.push(copyCurrentLine, copyBreakpoints);
}

// This method is called when your extension is deactivated
export function deactivate() {}
