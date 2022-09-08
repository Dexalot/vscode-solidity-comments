import * as vscode from 'vscode';

var indentString = require('indent-string');

import * as parser from './argParser';

// given a line number in the code with a function or modifier keyword
// this function expands the text until an opening '{' or ending ';'
export function expandToOpeningBracket(cNo: number): string {
	var line = vscode.window.activeTextEditor.document.lineAt(cNo);
	var cText = line.text.trim();

	line = vscode.window.activeTextEditor.document.lineAt(cNo++);
	var nText = line.text.trim();
	while (!nText.includes('{') && !nText.includes(';')) {
		line = vscode.window.activeTextEditor.document.lineAt(cNo++);
		nText = line.text.trim();
		cText = cText + " " + nText;
	}
	return cText;
}

export function insertText(textToInsert: string) {
	var selection = vscode.window.activeTextEditor.selection;
	var startLine = selection.start.line - 1;

	vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
		if (startLine < 0) {
			//If the function declaration is on the first line in the editor we need to set startLine to first line
			//and then add an extra newline at the end of the text to insert
			startLine = 0;
			textToInsert = textToInsert + '\n';
		}
		//Check if there is any text on startLine. If there is, add a new line at the end
		var lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
		var pos:vscode.Position;
		if ((lastCharIndex > 0) && (startLine !=0)) {
			pos = new vscode.Position(startLine, lastCharIndex);
			textToInsert = '\n' + textToInsert;
		}
		else {
			pos = new vscode.Position(startLine, 0);
			textToInsert = '\n' + textToInsert;
		}
		var line:string = vscode.window.activeTextEditor.document.lineAt(selection.start.line).text;
		var firstNonWhiteSpace :number = vscode.window.activeTextEditor.document.lineAt(selection.start.line).firstNonWhitespaceCharacterIndex;
		var numIndent : number = 0;
		var tabSize : number = vscode.window.activeTextEditor.options.tabSize;
		var stringToIndent: string = '';
		for (var i = 0; i < firstNonWhiteSpace; i++) {
			if (line.charAt(i) == '\t') {
				stringToIndent = stringToIndent + '\t';
			}
			else if (line.charAt(i) == ' ') {
				stringToIndent = stringToIndent + ' ';
			}
		}
		textToInsert = indentString(textToInsert, stringToIndent, 1);
		editBuilder.insert(pos, textToInsert);
	}).then(() => { });
}

export function activate(ctx:vscode.ExtensionContext) {

	vscode.commands.registerCommand('extension.addDocComments', () => {

		var lang = vscode.window.activeTextEditor.document.languageId;
		if (lang == "solidity") {
			var selection = vscode.window.activeTextEditor.selection;
			var selectedText = vscode.window.activeTextEditor.document.getText(selection);
			var currentLineNo = vscode.window.activeTextEditor.selection.active.line;

			var lineAt = vscode.window.activeTextEditor.document.lineAt(currentLineNo);
			var textAtCurrentLine = lineAt.text.trim();

			if(textAtCurrentLine.includes('contract') || textAtCurrentLine.includes('interface') || textAtCurrentLine.includes('library')) {
				insertText("/**\n * @author  .\n * @title   .\n * @dev     .\n * @notice  .\n */\n");
				return;
			}

			if(textAtCurrentLine.includes('function') || textAtCurrentLine.includes('modifier')) {
				selectedText = textAtCurrentLine;
				if (!selectedText.includes('{') && !selectedText.includes(';')) {
					selectedText = expandToOpeningBracket(currentLineNo)
				}
			}
			var outputMessage: string = 'Please move cursor to a line with one of these keywords: contract, interface, library, function or modifier'

			if (selectedText.length === 0) {
				vscode.window.showInformationMessage(outputMessage);
				return;
			}

			if (parser.stripComments(selectedText).length === 0) {
				vscode.window.showInformationMessage(outputMessage);
				return;
			}

			var firstBraceIndex = selectedText.indexOf('(');
			selectedText = selectedText.slice(firstBraceIndex);
			selectedText = parser.stripComments(selectedText);

			var lines: string[] = parser.splitTextByKeyword(selectedText, "returns");

			var functionParamsText = lines[0];
			var returnsParamsText = lines[1];

			var functionParams: parser.paramDef[] = parser.getFunctionParams(functionParamsText);
			var returnParams: parser.paramDef[] = parser.getReturnParams(returnsParamsText);

			if (functionParams.length > 0 || returnParams.length > 0) {
				var textToInsert = parser.getParameterText(functionParams, returnParams);
				insertText(textToInsert);
			}
		}
	});
}
