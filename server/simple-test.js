import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const api = axios.create({ baseURL: BASE_URL });

async function runTests() {
  console.log("Starting API tests...\n");

  try {
    console.log("1. Testing Register API");
    const registerRes = await api.post("/register", {
      fullName: "Test User",
      email: `user${Date.now()}@test.com`,
      password: "password123",
    });
    console.log("✓ Register:", registerRes.status, registerRes.data);
  } catch (err) {
    console.log(
      "✗ Register:",
      err.response?.status,
      err.response?.data || err.message,
    );
  }

  try {
    console.log("\n2. Testing Login API");
    const email = `user${Date.now()}@test.com`;

    await api.post("/register", {
      fullName: "Test User 2",
      email,
      password: "password123",
    });

    const loginRes = await api.post("/login", {
      email,
      password: "password123",
    });
    console.log("✓ Login:", loginRes.status, {
      accessToken: loginRes.data.accessToken?.substring(0, 20) + "...",
    });

    const token = loginRes.data.accessToken;

    console.log("\n3. Testing Get User API (with token)");
    const userRes = await api.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✓ Get User:", userRes.status, userRes.data);

    console.log("\n4. Testing Create Task API");
    const taskRes = await api.post(
      "/tasks",
      {
        title: "Test Task",
        description: "Test Description",
        status: "To Do",
        Deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("✓ Create Task:", taskRes.status, {
      id: taskRes.data._id,
      title: taskRes.data.title,
    });

    const taskId = taskRes.data._id;

    console.log("\n5. Testing Get Tasks API");
    const tasksRes = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(
      "✓ Get Tasks:",
      tasksRes.status,
      `Total: ${tasksRes.data.length}`,
    );

    console.log("\n6. Testing Get Task by ID API");
    const getTaskRes = await api.get(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✓ Get Task by ID:", getTaskRes.status, getTaskRes.data.title);

    console.log("\n7. Testing Update Task API");
    const updateRes = await api.put(
      `/tasks/${taskId}`,
      { title: "Updated Task Title" },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("✓ Update Task:", updateRes.status, updateRes.data.title);

    console.log("\n8. Testing Delete Task API");
    const deleteRes = await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✓ Delete Task:", deleteRes.status, deleteRes.data);
  } catch (err) {
    console.log(
      "✗ Error:",
      err.response?.status,
      err.response?.data || err.message,
    );
  }

  console.log("\n✓ Test suite completed!");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
