# VS Code Solidity Comments extension

This extension simplifies addition of NatSpec compliant @author, @title, @notice, @dev, @param and @return tags in Solidity files.

## Installation

The solidity-comments VS Code extension can be installed 1. from a VSIX file or 2. from VS Code Marketplace.
1. The VSIX file can be downloaded from the [release page](https://github.com/Dexalot/vscode-solidity-comments/releases) on GitHub.
   - Go to `Extensions` tab and click the `...` at the top.
   - Select `Install from VSIX` and point the file selector dialog to the downloaded VSIX file.
3. On the VS Code Marketplace the extension can be found with its name vscode-solidity-comments.
   - Just clisk Install.

## Using

* In a Solidity file, move the cursor to a line with a contract, interface, library, function or modifier keywords.

* Invoke the `Add Solidity Comments` extension
    - Open the command palette wit `F1` or `ctrl+shift+p` on Windows and find `Add Solidity Comments`. Hit enter.
    - Alternatively, you can use the keybindings `ctrl+alt+d` on Windows and `shift+cmd+d` on Mac.

* The extension will parse the signature on the line of the cursor and add NatSpec doc comments above the line.

    For contract, interface and library keywords the extension adds a header as follows:

    ```
        /**
        * @author  .
        * @title   .
        * @dev     .
        * @notice  .
        */
    ```

    For function and modifier keywords the extension adds comments as follows:

    ```
        /**
        * @notice  .
        * @dev     .
        * @param   _address  .
        * @return  bool  .
        */
    ```

## Limitations

The extension does not support any other type of NatSpec tags. It only uses @title, @author, @notice, @dev, @param and @return tags.

## Support

Please use the extension at your own risk as is knowing that there is no active support for it.

If you have a feature request or bug report you can open an issue from the [issues page](https://github.com/Dexalot/vscode-solidity-comments/issues) on GitHub.

Please note that there is no promise that these issues will be prioritized among other projects.
