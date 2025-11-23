POLYCOUNCIL - OFFLINE WORKBENCH
===============================

This is a local, privacy-focused tool. 

HOW TO RUN (RECOMMENDED METHOD)
-------------------------------
The most reliable way to run this app is via your computer's terminal. This avoids permission errors with shortcut files.

1. Open your Terminal (Mac) or Command Prompt (Windows).
2. Navigate to this folder.
   (Tip: Type "cd " then drag this folder into the terminal window and press Enter)
3. Install dependencies by typing:
   npm install
   (Press Enter and wait for it to finish)
4. Start the app by typing:
   npm run dev
   (Press Enter)
5. Open the Local URL shown (usually http://localhost:5173).

FAQ: CAN I BOOKMARK THE APP?
----------------------------
YES. You can bookmark http://localhost:5173 in your browser.
HOWEVER: The Terminal window (step 4 above) MUST be running for the bookmark to work. 
If you close the terminal, the site will stop loading.

MAKING THE SHORTCUT (start.command) WORK
----------------------------------------
If you want to just double-click `start.command` instead of using the Terminal manually, you must give it permission once.

1. Open Terminal.
2. Type: chmod +x 
   (Note the space after x)
3. Drag the `start.command` file from your folder into the Terminal window.
4. Press Enter.

Now you should be able to double-click `start.command` to launch the app instantly.

TROUBLESHOOTING
---------------
- If `npm install` fails, ensure you have Node.js installed from https://nodejs.org/
- If the app opens but is blank, check the Terminal window for errors.
