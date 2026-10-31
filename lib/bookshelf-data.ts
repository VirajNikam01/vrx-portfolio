import "server-only";
import { cache } from "react";
import { recommendationsService } from "@/backend/services/recommendations";

export const readBookshelfCatalog = cache(recommendationsService.readBookshelfCatalog);
