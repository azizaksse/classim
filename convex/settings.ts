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

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        }

        return await ctx.db.insert("store_settings", {
            key: STORE_CONFIG_KEY,
            delivery_price: args.delivery_price ?? 0,
            delivery_prices_by_wilaya: args.delivery_prices_by_wilaya ?? {},
            facebook_pixels: args.facebook_pixels ?? [],
            updated_at: new Date().toISOString(),
        });
    },
});
