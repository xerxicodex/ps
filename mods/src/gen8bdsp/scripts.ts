import type {ModdedBattleScriptsData} from '@nxpkmn/sim';

export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	side: {
		canDynamaxNow() {
			// Dynamaxing is not in BDSP
			return false;
		},
	},
};
