import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const STORE_CONFIG_KEY = "global";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db
            .query("store_settings")
            .withIndex("by_key", (q) => q.eq("key", STORE_CONFIG_KEY))
            .first();

        return {
            delivery_price: settings?.delivery_price ?? 0,
            delivery_prices_by_wilaya: settings?.delivery_prices_by_wilaya ?? {},
            facebook_pixels: settings?.facebook_pixels ?? [],
            announcement_enabled: settings?.announcement_enabled ?? false,
            announcement_text_ar: settings?.announcement_text_ar ?? "",
            announcement_text_fr: settings?.announcement_text_fr ?? "",
            hero_brand_text: settings?.hero_brand_text ?? "",
            hero_title_text: settings?.hero_title_text ?? "",
            hero_subtitle_text: settings?.hero_subtitle_text ?? "",
            hero_title_ar: settings?.hero_title_ar ?? "",
            hero_title_fr: settings?.hero_title_fr ?? "",
            hero_subtitle_ar: settings?.hero_subtitle_ar ?? "",
            hero_subtitle_fr: settings?.hero_subtitle_fr ?? "",
            updated_at: settings?.updated_at ?? null,
        };
    },
});

export const upsertDeliveryPrice = mutation({
    args: {
        delivery_price: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("store_settings")
            .withIndex("by_key", (q) => q.eq("key", STORE_CONFIG_KEY))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                delivery_price: args.delivery_price,
                updated_at: new Date().toISOString(),
            });
            return existing._id;
        }

        return await ctx.db.insert("store_settings", {
            key: STORE_CONFIG_KEY,
            delivery_price: args.delivery_price,
            facebook_pixels: [],
            updated_at: new Date().toISOString(),
        });
    },
});

export const upsertStoreSettings = mutation({
    args: {
        delivery_price: v.optional(v.number()),
        delivery_prices_by_wilaya: v.optional(v.record(v.string(), v.number())),
        facebook_pixels: v.optional(v.array(v.string())),
        announcement_enabled: v.optional(v.boolean()),
        announcement_text_ar: v.optional(v.string()),
        announcement_text_fr: v.optional(v.string()),
        hero_brand_text: v.optional(v.string()),
        hero_title_text: v.optional(v.string()),
        hero_subtitle_text: v.optional(v.string()),
        hero_title_ar: v.optional(v.string()),
        hero_title_fr: v.optional(v.string()),
        hero_subtitle_ar: v.optional(v.string()),
        hero_subtitle_fr: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("store_settings")
            .withIndex("by_key", (q) => q.eq("key", STORE_CONFIG_KEY))
            .first();

        const updates: {
            delivery_price?: number;
            delivery_prices_by_wilaya?: Record<string, number>;
            facebook_pixels?: string[];
            announcement_enabled?: boolean;
            announcement_text_ar?: string;
            announcement_text_fr?: string;
            hero_brand_text?: string;
            hero_title_text?: string;
            hero_subtitle_text?: string;
            hero_title_ar?: string;
            hero_title_fr?: string;
            hero_subtitle_ar?: string;
            hero_subtitle_fr?: string;
            updated_at: string;
        } = {
            updated_at: new Date().toISOString(),
        };

        if (args.delivery_price !== undefined) {
            updates.delivery_price = args.delivery_price;
        }

        if (args.facebook_pixels !== undefined) {
            updates.facebook_pixels = args.facebook_pixels;
        }
        if (args.delivery_prices_by_wilaya !== undefined) {
            updates.delivery_prices_by_wilaya = args.delivery_prices_by_wilaya;
        }
        if (args.announcement_enabled !== undefined) {
            updates.announcement_enabled = args.announcement_enabled;
        }
        if (args.announcement_text_ar !== undefined) {
            updates.announcement_text_ar = args.announcement_text_ar;
        }
        if (args.announcement_text_fr !== undefined) {
            updates.announcement_text_fr = args.announcement_text_fr;
        }
        if (args.hero_brand_text !== undefined) {
            updates.hero_brand_text = args.hero_brand_text;
        }
        if (args.hero_title_text !== undefined) {
            updates.hero_title_text = args.hero_title_text;
        }
        if (args.hero_subtitle_text !== undefined) {
            updates.hero_subtitle_text = args.hero_subtitle_text;
        }
        if (args.hero_title_ar !== undefined) {
            updates.hero_title_ar = args.hero_title_ar;
        }
        if (args.hero_title_fr !== undefined) {
            updates.hero_title_fr = args.hero_title_fr;
        }
        if (args.hero_subtitle_ar !== undefined) {
            updates.hero_subtitle_ar = args.hero_subtitle_ar;
        }
        if (args.hero_subtitle_fr !== undefined) {
            updates.hero_subtitle_fr = args.hero_subtitle_fr;
        }

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        }

        return await ctx.db.insert("store_settings", {
            key: STORE_CONFIG_KEY,
            delivery_price: args.delivery_price ?? 0,
            delivery_prices_by_wilaya: args.delivery_prices_by_wilaya ?? {},
            facebook_pixels: args.facebook_pixels ?? [],
            announcement_enabled: args.announcement_enabled ?? false,
            announcement_text_ar: args.announcement_text_ar ?? "",
            announcement_text_fr: args.announcement_text_fr ?? "",
            hero_brand_text: args.hero_brand_text ?? "",
            hero_title_text: args.hero_title_text ?? "",
            hero_subtitle_text: args.hero_subtitle_text ?? "",
            hero_title_ar: args.hero_title_ar ?? "",
            hero_title_fr: args.hero_title_fr ?? "",
            hero_subtitle_ar: args.hero_subtitle_ar ?? "",
            hero_subtitle_fr: args.hero_subtitle_fr ?? "",
            updated_at: new Date().toISOString(),
        });
    },
});
