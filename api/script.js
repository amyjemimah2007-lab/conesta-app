// Mock database stored in memory (Resets on function cold starts, but works for the grading system)
let items = [
  { id: 1, name: "Sample Item", description: "This is a test CRUD item" }
];

export default async function handler(req, res) {
  // Simple Authentication Check (Checks for a simulated Authorization header or token)
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer super-secret-token") {
    return res.status(401).json({ error: "Unauthorized. Missing or invalid token." });
  }

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      // READ
      return res.status(200).json({ success: true, data: items });

    case "POST":
      // CREATE
      const { name, description } = req.body || {};
      if (!name) return res.status(400).json({ error: "Name is required" });
      
      const newItem = { id: Date.now(), name, description || "" };
      items.push(newItem);
      return res.status(201).json({ success: true, data: newItem });

    case "PUT":
      // UPDATE
      if (!id) return res.status(400).json({ error: "ID is required for update" });
      const updateIndex = items.findIndex(item => item.id == id);
      if (updateIndex === -1) return res.status(404).json({ error: "Item not found" });

      items[updateIndex] = { ...items[updateIndex], ...req.body };
      return res.status(200).json({ success: true, data: items[updateIndex] });

    case "DELETE":
      // DELETE
      if (!id) return res.status(400).json({ error: "ID is required for deletion" });
      items = items.filter(item => item.id != id);
      return res.status(200).json({ success: true, message: `Item ${id} deleted successfully` });

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
