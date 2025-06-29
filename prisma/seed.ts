import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const userData: Prisma.UserCreateInput[] = [
  {
    name: "nima",
    email: "nima@gmail.com",
    password: "hellothere",
    posts: {
      create: [
        {
          title: "testing",
          content: "testing this shit",
          slug: "test",
          published: true,
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
