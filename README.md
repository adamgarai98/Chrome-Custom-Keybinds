# Shortcut Launcher for Chrome

## Overview

Shortcut Launcher is a Chrome extension that lets you open websites quickly using custom keyboard shortcuts. Instead of a few fixed shortcuts, you can use any key to open a pre-set URL.

## How it Works

1.  **Quick Launch**: Open the extension popup (default `Alt+Z`). Press a single key (e.g., `1`, `a`, `b`) to open the linked URL. If your current tab is a new tab page, the URL will open there; otherwise, a new tab will be created.
2.  **Easy Configuration**: Manage your shortcuts in the popup's "Configuration" tab or the full options page. Add, edit, or delete key-URL pairs. Changes save automatically when you leave an input field.
3.  **"Save Current URL"**: Assign the URL of your current active tab to a new shortcut directly from the popup.

## Installation

1.  **From the Chrome Web Store**:
    *   *Waiting for approval*
    *   ~~Go to the [Shortcut Launcher page on the Chrome Web Store](CHROME_WEB_STORE_URL_HERE).~~
    *   ~~Click "Add to Chrome" and confirm the installation.~~

2.  **From Source (for developers)**:
    *   Download or clone this repository to your local machine.
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" using the toggle switch in the top right corner.
    *   Click on "Load unpacked" and select the directory where you downloaded/cloned the extension.

## Changing the Default Shortcut (`Alt+Z`)

The default shortcut to open the Shortcut Launcher popup is `Alt+Z`. To change this (e.g., to `Ctrl+Shift+S`), follow these steps:

1.  Open Chrome.
2.  Go to `chrome://extensions/shortcuts`.
3.  Find "Shortcut Launcher" in the list of extensions.
4.  Click the input field next to "Activate the extension" and press your desired new key combination.
5.  Your custom shortcut will save automatically.

## Usage Example

1.  Install the extension.
2.  Navigate to the website you want to save (e.g., `https://www.google.com`).
3.  Open the Shortcut Launcher popup by pressing `Alt+Z` (or clicking the extension icon).
4.  Click the "Save Current URL" button in the top right.
5.  A prompt will appear. Press the single key you want to assign to this URL (e.g., `g`).
6.  The URL is now saved. Close the popup.
7.  Open the popup again (Alt+Z) and press `g` on your keyboard. Google will open!