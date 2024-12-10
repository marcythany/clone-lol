import { LolApi } from "twisted";

const leagueApi = new LolApi({
	rateLimitRetry: true,
	rateLimitRetryAttempts: 1,
	concurrency: 5,
	key: process.env.RIOT_API_KEY || "",
	debug: {
		logTime: false,
		logUrls: false,
		logRatelimits: false,
	},
});

export default leagueApi;
