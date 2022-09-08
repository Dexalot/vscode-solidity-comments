
export class paramDef {
	constructor(public paramName: string, public paramType: string) {
		this.paramName = paramName;
		this.paramType = paramType;
	}
}

export function getParameterText(functionParams: paramDef[], returnParams: paramDef[]): string {
	var textToInsert: string = "";
	textToInsert = textToInsert + '/**\n * @notice  .\n * @dev     .\n';
	functionParams.forEach(element => {
		if (element.paramName != '') {
			textToInsert = textToInsert + ' * @param   ';
			// textToInsert = textToInsert + '{' + element.paramType + '}' + ' ';  // for type insertion
			textToInsert = textToInsert + element.paramName + '  .' + '\n';
		}
	});
	returnParams.forEach(element => {
		if (element.paramType != '') {
			textToInsert = textToInsert + ' * @return  ';
			// textToInsert = textToInsert + '{' + element.paramType + '}' + ' ';  // for type insertion
			if (element.paramName != '') {
				textToInsert = textToInsert + element.paramName + '  .' + '\n';
			} else {
				// textToInsert = textToInsert + 'UNNAMED' + '\n';                 // for type insertion
				textToInsert = textToInsert + element.paramType + '  .' + '\n';
			}
		}
	});
	textToInsert = textToInsert + ' */';
	return textToInsert;
}

// split a given line by a keyword
// for Solidity keyword is expected to be used with 'returns'
// everything before 'returns' will be used to build lines[0] for function parameters
// everything after 'returns' will be used to build lines[1] for the return parameters
export function splitTextByKeyword(text: string, keyword: string): string[] {
	const result = text.trim().split(/\s+/);
	const index = result.indexOf("{", 0);
	if (index > -1) {
		result.splice(index, 1);
	}
	let lines: string[] = [];
	const rPos = result.indexOf(keyword);
	if (rPos != -1) {
		lines[0] = result.slice(0, rPos).join(" ");
		lines[1] = result.slice(rPos + 1, result.length).join(" ");
	} else {
		lines[0] = result.slice(0, result.length).join(" ");
		lines[1] = "";
	}
	return lines;
}

//Assumes that the string passed in starts with ( and continues to ) and does not contain any comments
export function getFunctionParams(text: string): paramDef[] {
	var params: paramDef[] = [];
	//Start by looking for the function name declaration
	var index = 0;
	text = text.trim(); // delete the leading and trailing spaces
	//if there is no '(' then this is not a valid function declaration
	if (text.charAt(index) == '(') {
		//count the number of matching opening and closing braces. Keep parsing until 0
		var numBraces = 1;
		index++;
		while ((numBraces != 0) && (index != text.length)) {
			var name_type: string = '';
			while ((text.charAt(index) != ',') && (text.charAt(index) != ')') && (index < text.length)) {
				name_type = name_type + text.charAt(index);
				index++;
			}
			if (text.charAt(index) == ')') {
				numBraces--;
			}
			name_type = name_type.trim() // trim leading and trailing whitespace
			let parts = name_type.split(" ");  // spitting a returns element (bool b, uint256 u, ...)
			let idx = parts.indexOf("memory", 0);  // remove memory from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			idx = parts.indexOf("calldata", 0);    // remove calldata from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			idx = parts.indexOf("storage", 0);     // remove storage from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			if (parts.length == 1) {
				params.push(new paramDef("", ""));
			} else if (parts.length == 2) {
				params.push(new paramDef(parts[1], parts[0]));
			} else {
				const errorMessage = "Arguments are malformed in the selected code";
				throw new Error(errorMessage);
			}
			if (index < text.length) {
				index++;
				while (text.charAt(index) == ' ') index++;  // consume whitespace
			}
		}
	}
	return params;
}

//Assumes that the string passed in starts with ( and continues to ) and does not contain any comments
export function getReturnParams(text: string): paramDef[] {
	var params: paramDef[] = [];
	//Start by looking for the function name declaration
	var index = 0;
	text = text.trim(); // delete the leading and trailing spaces
	//if there is no '(' then this is not a valid function declaration
	if (text.charAt(index) == '(') {
		//count the number of matching opening and closing braces. Keep parsing until 0
		var numBraces = 1;
		index++;
		while ((numBraces != 0) && (index != text.length)) {
			var name_type: string = '';
			while ((text.charAt(index) != ',') && (text.charAt(index) != ')') && (index < text.length)) {
				name_type = name_type + text.charAt(index);
				index++;
			}
			if (text.charAt(index) == ')') {
				numBraces--;
			}
			name_type = name_type.trim() // trim leading and trailing whitespace
			const parts = name_type.split(" ");  // spitting a returns element (bool b, uint256 u, ...) or (bool, uint256, ...)
			let idx = parts.indexOf("memory", 0);  // remove memory from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			idx = parts.indexOf("calldata", 0);    // remove calldata from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			idx = parts.indexOf("storage", 0);     // remove storage from parts
			if (idx > -1) {
				parts.splice(idx, 1);
			}
			if (parts.length == 0) {
				params.push(new paramDef("", ""));
			} else if (parts.length == 2) {
				params.push(new paramDef(parts[1], parts[0]));
			} else if (parts.length == 1) {
				params.push(new paramDef("", parts[0]));
			} else {
				const errorMessage = "Elements of returns are malformed in the selected code";
				throw new Error(errorMessage);
			}
			if (index < text.length) {
				index++;
				while (text.charAt(index) == ' ') index++;  // consume whitespace
			}
		}
	}
	return params;
}

export function stripComments(text: string): string {
	var uncommentedText: string = '';
	var index = 0;
	while (index != text.length) {
		if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '*')) {
			//parse comment
			if ((index + 2) != text.length) { //Check for the corner case that the selected text contains a /* right at the end
				index = index + 2;
				while ((text.charAt(index) != '*') && (text.charAt(index + 1) != '/')) {
					index++;
				}
			}
			index = index + 2;
		}
		else if ((text.charAt(index) == '/') && (text.charAt(index + 1) == '/')) {
			//read to end of line
			while ((text.charAt(index) != '\n') && (index < text.length)) {
				index++;
			}
		}
		else {
			uncommentedText = uncommentedText + text.charAt(index);
			index++;
		}
	}
	return uncommentedText;
}
