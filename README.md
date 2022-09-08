# VS Code Solidity Comments extension
Adds NatSpec compliant @notice, @dev, @param and @return tags for function and modifier signatures in Solidity files.

## Installation
Currently, the solidity-comments VS Code extension is installed from a VSIX file only.

Go to `Extensions` tab and click the `...` at the top.

Select `Install from VSIX`.

## Using
In a Solidity file, move the cursor to a line with a function or modifier signature.

Invoke the `Add Solidity Comments` extension
- Open the command palette wit `F1` or `ctrl+shift+p` on Windows and find `Add Solidity Comments`. Hit enter.
- Alternatively, you can use the keybindings `ctrl+alt+d` on Windows and `shift+cmd+d` on Mac.

The extension will parse the signature on the line of the cursor. A stub with @notice, @dev, @param and @return tags for each parameter and return variables will be added directly above the line.

## Limitations
The extension does not support any other type of NatSpec tags. It only uses @notice, @dev, @param and @return
