import type { Context } from "hono";

const HealthController = (c: Context) => {
	return c.json({
		status: "ok",
		message: "Server is healthy",
		results: {},
	});
};

export default HealthController;
