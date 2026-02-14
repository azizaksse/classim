# Google Apps Script for Octomatic Integration

If you prefer to push data using a script **inside** the Google Sheet (e.g. if you are using a form that submits directly to the sheet, or if you want to pull data), you can use this script.

**However, the implementation I built in your Classimo app pushes data DIRECTLY to the sheet, so you likely DO NOT NEED THIS unless you want to manually fetch data from your side.**

If you are just looking for the **Column Structure** that acts as the "Script" for Octomatic to read, ensure your sheet has these headers:

1.  **Date**
2.  **Nom Complet** (Customer Name)
3.  **Téléphone**
4.  **Wilaya**
5.  **Commune**
6.  **Adresse**
7.  **Produit**
8.  **Quantité**
9.  **Prix Total**
10. **Remarque**

---

## Testing Your Connection

I have created a test script in your project to verify your credentials are correct.

1. Open a terminal in your project folder.
2. Run:
   ```bash
   node scripts/test-google-sheets.js
   ```
3. If it fails, it will tell you exactly why (e.g., "invalid private key" or "needs permission").

This is the BEST way to fix "Info is Bad" errors.
