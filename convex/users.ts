import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserRole = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const userRole = await ctx.db
            .query("user_roles")
            .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
            .first();
        return userRole?.role;
    },
});

export const setUserRole = mutation({
    args: {
        userId: v.string(),
        role: v.union(v.literal("admin"), v.literal("moderator"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const existingRole = await ctx.db
            .query("user_roles")
            .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
            .first();

        if (existingRole) {
            await ctx.db.patch(existingRole._id, { role: args.role });
        } else {
            await ctx.db.insert("user_roles", {
                user_id: args.userId,
                role: args.role,
                created_at: new Date().toISOString(),
            });
        }
    },
});
