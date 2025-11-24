POLYCOUNCIL - OFFLINE WORKBENCH
===============================

This is a local, privacy-focused tool running as a standalone app.

PREREQUISITES (macOS)
---------------------
1. You must have Node.js installed. 
   - Download the "LTS" version from: https://nodejs.org/
   - Run the installer.

HOW TO BUILD THE MAC APP (.DMG)
-------------------------------
1. Open the "Terminal" app on your Mac (Cmd+Space, type "Terminal").
2. Navigate to this folder. 
   - Type `cd ` (with a space) and drag this folder into the terminal window, then press Enter.
3. Install the project dependencies:
   npm install
4. Create the Mac application:
   npm run dist:mac
5. Wait for the process to finish. It will create a `release` folder in this directory.
6. Open the `release` folder. You will see `PolyCouncil-1.0.2.dmg`.

INSTALLING THE APP
------------------
1. Double-click the .dmg file.
2. Drag PolyCouncil into your Applications folder (or just to your desktop).
3. Eject the drive image.

OPENING THE APP (IMPORTANT)
---------------------------
Since this app is built locally and not signed by Apple ($99/year developer fee), macOS might prevent it from opening initially.

To open it:
1. Right-click (or Control-click) the PolyCouncil app.
2. Select "Open".
3. A dialog will appear warning you about the developer. Click "Open" again.
4. You only need to do this once. Afterward, you can double-click it normally.

TROUBLESHOOTING
---------------
- If `npm install` fails, ensure Node.js is installed.
- If the build screen stays white, ensure the `dist` folder was created during the build process.
