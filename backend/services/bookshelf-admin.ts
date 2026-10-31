import "server-only";
import { recommendationsService } from "./recommendations";
import { recommendationTopicsService } from "./recommendation-topics";
import type { AdminItemInput, AdminTopicInput } from "@/shared/contracts/bookshelf-admin";
import { AdminError } from "@/backend/errors/admin";

async function updateItem(id: number, input: AdminItemInput) {
    return recommendationsService.withAdminItem(id, async (current, tx) => {
        if (!["book", "course"].includes(input.type) && ["book", "course"].includes(current.type)) {
            const topics = await recommendationTopicsService.readAdminTopics(id, tx);
            if (topics.length) throw new AdminError(422, "This item has chapter notes. Keep its type as Book or Course.", { type: ["Chapter notes depend on this media type"] });
        }
        return recommendationsService.updateAdminItem(current, input, tx);
    });
}
async function saveTopic(parentId: number, input: AdminTopicInput, topicId?: number) {
    return recommendationsService.withAdminItem(parentId, async (parent, tx) => {
        if (!["book", "course"].includes(parent.type)) throw new AdminError(422, "Only books and courses support chapter notes");
        return topicId === undefined ? recommendationTopicsService.createAdminTopic(parentId, input, tx) : recommendationTopicsService.updateAdminTopic(parentId, topicId, input, tx);
    });
}
export const bookshelfAdminService = { updateItem, saveTopic };
