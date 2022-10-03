# Changelog

## v1.1.2 Release

- still learning VS Code Marketplace, added changelog
- fixed typos

## v1.1.1 Release

- learning VS Code Marketplace
- updated the README with Marketplace info
- bumped version.

## v1.1.0 Release

- First public release

## v1.0.4 Release Candidate 5

- refactored duplicated code

## v1.0.3 Release Candidate 4

- fixed bug with payable keyword in the argument list

## v1.0.2 Release Candidate 3

Implemented exact matching of keywords with regular expressions so a parameter as _contract or interface1 etc. still generate correct tags.

## v1.0.0 Release Candidate 1

- updated metadata
- improved ReadMe

## v1.0.0 Release Candidate 1

This is the first (pre-)release of VS Code Solidity documentation helper.

It recognizes contract, interface, library, function and modifier keywords on the current line and adds NatSpec doc comments above the line.

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
