import { DifficultyEnumType } from "@prisma/client";

export const DifficultyColors = {
    [DifficultyEnumType.easy]: { border: "border-green-500", background: "bg-green-500", text: "text-green-500"  },
    [DifficultyEnumType.medium]: { border: "border-yellow-500", background: "bg-yellow-500", text: "text-yellow-500"  },
    [DifficultyEnumType.hard]: { border: "border-rose-500", background: "bg-rose-500", text: "text-rose-500"  },
    [DifficultyEnumType.very_hard]: { border: "border-rose-500", background: "bg-rose-500", text: "text-rose-500"  },
    [DifficultyEnumType.master]: { border: "border-fuchsia-500", background: "bg-fuchsia-500", text: "text-fuchsia-500"  }
}