export function helloHttp(req, res) {
    const apiKey = process.env.API_KEY;
    if (req.headers["x-api-key"] !== apiKey) {
        res.status(401).send("Unauthorized");
        return;
    }
    res.send("Hello from secure function!");
}
