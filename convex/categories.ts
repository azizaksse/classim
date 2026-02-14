import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const categories = await ctx.db.query("categories").order("desc").collect();
        const categoriesWithImages = await Promise.all(
            categories.map(async (category) => {
                if (!category.image_url) {
                    return { ...category, image_data: [] };
                }
                if (category.image_url.startsWith("http")) {
                    // Try to recover storageId from Convex storage URLs
                    const match = category.image_url.match(/\/api\/storage\/([^?/#]+)/);
                    const storageId = match?.[1];
                    if (storageId) {
                        const url = await ctx.storage.getUrl(storageId);
                        return {
                            ...category,
                            image_url: url || category.image_url,
                            image_data: [{ id: storageId, url: url || category.image_url }],
                        };
                    }
                    return {
                        ...category,
                        image_data: [{ url: category.image_url }],
                    };
                }
                const url = await ctx.storage.getUrl(category.image_url);
                return {
                    ...category,
                    image_url: url || category.image_url,
                    image_data: [{ id: category.image_url, url: url || category.image_url }],
                };
            })
        );
        return categoriesWithImages;
    },
});

export const create = mutation({
    args: {
        name_ar: v.string(),
        name_fr: v.string(),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const categoryId = await ctx.db.insert("categories", {
            ...args,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return categoryId;
    },
});

export const update = mutation({
    args: {
        id: v.id("categories"),
        updates: v.object({
            name_ar: v.optional(v.string()),
            name_fr: v.optional(v.string()),
            image_url: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            ...args.updates,
            updated_at: new Date().toISOString(),
        });
    },
});

export const remove = mutation({
    args: { id: v.id("categories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
