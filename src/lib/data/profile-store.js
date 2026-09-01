import prisma from "@/lib/prisma";

export async function getUserOrders(userId) {
  const userWithOrders = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      storeOrders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  slug: true,
                  images: true,
                  category: { select: { slug: true } },
                },
              },
              variant: { include: { attributes: true } },
            },
          },
        },
      },
      webOrders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return {
    storeOrders: userWithOrders?.storeOrders || [],
    webOrders: userWithOrders?.webOrders || [],
  };
}
