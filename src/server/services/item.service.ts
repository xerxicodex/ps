import { Item, Prisma } from "@prisma/client";

export const CreateItem = async (input: Prisma.ItemCreateInput) => {
    return (await prisma.item.create({
        data: input,
    })) as Item;
};

export const FindItem = async (
    where: Partial<Prisma.ItemWhereInput>,
    select?: Prisma.ItemSelect
) => {
    return (await prisma.item.findFirst({
        where,
        select,
    })) as Item;
};

export const FindUniqueItem = async (
    where: Prisma.ItemWhereUniqueInput,
    select?: Prisma.ItemSelect
) => {
    return (await prisma.item.findUnique({
        where,
        select,
    })) as Item;
};

export const UpdateItem = async (
    where: Partial<Prisma.ItemWhereUniqueInput>,
    data: Prisma.ItemUpdateInput,
    select?: Prisma.ItemSelect
) => {
    return (await prisma.item.update({ where, data, select })) as Item;
};

export async function GetItemById(id: number) {
    return await FindItem({ id });
}

export async function GetItemByName(name: string) {
    return await FindItem({ name });
}
