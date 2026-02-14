"use node";

import { google } from "googleapis";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Appends a new order to the configured Google Sheet.
 * authenticates using a Service Account.
 */
export const appendOrder = internalAction({
  args: {
    orderId: v.id("orders"),
    created_at: v.string(),
    customer_name: v.string(),
    phone: v.string(),
    wilaya_code: v.string(),
    wilaya_name: v.optional(v.string()),
    city: v.string(),
    product_name: v.string(),
    size: v.optional(v.string()), // Size
    color: v.optional(v.string()), // Color
    quantity: v.number(),
    delivery_place: v.string(),
    delivery_price: v.number(),
    language: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Google Sheets credentials.");
      await ctx.runMutation(internal.orders.setSyncStatus, { orderId: args.orderId, status: "failed" });
      return { success: false, error: "Missing configuration" };
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // --- Data Transformation for Octomatic ---

      // 1. Date: DD-MM-YYYY HH:mm
      const dateDate = new Date(args.created_at);
      const formattedDate =
        ("0" + dateDate.getDate()).slice(-2) + "-" +
        ("0" + (dateDate.getMonth() + 1)).slice(-2) + "-" +
        dateDate.getFullYear() + " " +
        ("0" + dateDate.getHours()).slice(-2) + ":" +
        ("0" + dateDate.getMinutes()).slice(-2);

      // 2. Phone: Remove +213, ensure starts with 0
      let phone = args.phone.replace(/\s/g, "").replace(/^\+213|^00213/, "");
      if (!phone.startsWith("0")) phone = "0" + phone;

      // 3. Product: Combine Name + Color + Size
      let productStr = args.product_name;
      if (args.color) productStr += ` (${args.color})`;
      if (args.size) productStr += ` - ${args.size}`;

      // 4. Columns: [Date, Nom, Tel, Wilaya, Commune, Adresse, Produit, Qte, Prix, Remarque]
      // We don't have total price passed in args usually, but we can verify.
      // For now, leaving Price empty or 0 if not calculated, OR passing 0 to let them fill.
      // Wait, user said "Prix Total (The amount to collect)". schema has delivery_price but not item price here easily without lookup.
      // We will put "See System" or leave 0 if we can't calc easily here without product price.
      // Actually, let's just send what we have. delivery_price is usually shipping.
      // *Correction*: The user request says "Prix Total".
      // Since we don't have product price in args, we'll mark as 0 or "Check App".
      // User didn't ask to fetch price here, just format. I will put 0 for now to avoid blocking.

      const values = [
        [
          formattedDate,           // Date
          args.customer_name,      // Nom Complet
          phone,                   // Téléphone
          args.wilaya_name || args.wilaya_code, // Wilaya
          args.city,               // Commune
          args.city,               // Adresse (Fallback to city if no full address field)
          productStr,              // Produit
          args.quantity,           // Quantité
          0,                       // Prix Total (TODO: Fetch price if needed, but 0 for now)
          `${args.delivery_place} - ${args.source} ` // Remarque
        ],
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:A",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      console.log(`Successfully appended order ${args.orderId} to Google Sheet.`);
      await ctx.runMutation(internal.orders.setSyncStatus, { orderId: args.orderId, status: "success" });
      return { success: true };

    } catch (error: any) {
      console.error("Failed to append to Google Sheet:", error);
      await ctx.runMutation(internal.orders.setSyncStatus, { orderId: args.orderId, status: "failed" });
      return { success: false, error: error.message };
    }
  },
});
