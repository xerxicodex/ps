export async function GetItemById(id: number) {
    return await prisma.item.findFirst({ where: { id } });
}

export async function GetItemByName(name: string) {
    return await prisma.item.findFirst({ where: { name } });
}
