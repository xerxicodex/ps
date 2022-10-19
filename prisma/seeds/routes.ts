import { Prisma } from "@prisma/client";

const _routes: Prisma.RouteCreateInput[] = new Array(28)
    .fill({})
    .map((x, i) => ({ name: `Route ${i + 1}` }));

export const routes = _routes;
