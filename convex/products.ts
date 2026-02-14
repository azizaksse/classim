import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").order("desc").collect();
        const productsWithCategories = await Promise.all(
            products.map(async (product) => {
                let categoryName = "Uncategorized";
                if (product.category_id) {
                    const category = await ctx.db.get(product.category_id);
                    if (category) {
                        categoryName = category.name_fr;
                    }
                }

                const images = await Promise.all(
                    (product.images || []).map(async (storageId) => {
                        if (storageId.startsWith("http")) return { url: storageId };
                        const url = await ctx.storage.getUrl(storageId);
                        return { id: storageId, url: url || "" };
                    })
                );

                return {
                    ...product,
                    category_name: categoryName,
                    images: images.map(i => i.url).filter(Boolean),
                    image_data: images,
                };
            })
        );
        return productsWithCategories;
    },
});

export const create = mutation({
    args: {
        category_id: v.optional(v.id("categories")),
        name_ar: v.string(),
        name_fr: v.string(),
        description_ar: v.optional(v.string()),
        description_fr: v.optional(v.string()),
        rent_price: v.number(),
        sale_price: v.optional(v.number()),
        images: v.optional(v.array(v.string())),
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
        is_active: v.optional(v.boolean()),
        is_featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const productId = await ctx.db.insert("products", {
            ...args,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return productId;
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        updates: v.object({
            category_id: v.optional(v.id("categories")),
            name_ar: v.optional(v.string()),
            name_fr: v.optional(v.string()),
            description_ar: v.optional(v.string()),
            description_fr: v.optional(v.string()),
            rent_price: v.optional(v.number()),
            sale_price: v.optional(v.number()),
            images: v.optional(v.array(v.string())),
            sizes: v.optional(v.array(v.string())),
            colors: v.optional(v.array(v.string())),
            is_active: v.optional(v.boolean()),
            is_featured: v.optional(v.boolean()),
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
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
