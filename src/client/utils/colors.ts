import { DifficultyEnumType } from "@prisma/client";

export const DifficultyColors = {
    [DifficultyEnumType.easy]: { background: "bg-green-500", text: "text-green-500"  },
    [DifficultyEnumType.medium]: { background: "bg-yellow-500", text: "text-yellow-500"  },
    [DifficultyEnumType.hard]: { background: "bg-rose-500", text: "text-rose-500"  },
    [DifficultyEnumType.very_hard]: { background: "bg-rose-500", text: "text-rose-500"  },
    [DifficultyEnumType.master]: { background: "bg-fuchsia-500", text: "text-fuchsia-500"  }
}