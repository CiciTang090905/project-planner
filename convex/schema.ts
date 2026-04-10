import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
  }).index("by_deletedAt", ["deletedAt"]), //soft delete implementation, that's only present on deleted documents
  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
  }).index("by_project", ["projectId"]), // 👀
});//.index("by_project_status", ["projectId", "status"]) also valid
//sorts by ["projectId", "_creationTime"] automatically

//one-to-many relationship: one project has many tasks, and each task belongs to one project.
//if add a task with a projectId that looks like a valid document ID, it will be accepted even if it does not exist
//not enforce relationship due to Convex as a backend-as-a-service, which does not support foreign key constraints.
