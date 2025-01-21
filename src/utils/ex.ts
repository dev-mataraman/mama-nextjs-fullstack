import { Hono } from "hono";
import type { Context } from "hono";

const ExController = (c: Context) => {
	return c.json({
		status: "ok",
		message: "Server is healthy",
		results: {},
	});
};
const ex = new Hono().get("/ex", ExController).post("/ex", ExController);

export default ex;
