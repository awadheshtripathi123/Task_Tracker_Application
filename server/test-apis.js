import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

let accessToken = "";
let refreshToken = "";
let userId = "";
let taskId = "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function test(name, fn) {
  try {
    console.log(`\n✓ Testing: ${name}`);
    await fn();
  } catch (error) {
    console.error(`✗ Failed: ${name}`);
    console.error(error.response?.data || error.message);
  }
}

async function runTests() {
  console.log("=".repeat(50));
  console.log("BACKEND API TEST SUITE");
  console.log("=".repeat(50));

  await test("Register User", async () => {
    const response = await api.post("/register", {
      fullName: "Test User",
      email: `testuser${Date.now()}@example.com`,
      password: "password123",
    });
    console.log("  Response:", response.data);
  });

  const email = `testuser${Date.now()}@example.com`;

  await test("Register Another User for Testing", async () => {
    const response = await api.post("/register", {
      fullName: "Test User 2",
      email,
      password: "password123",
    });
    console.log("  Response:", response.data);
  });

  await test("Login User", async () => {
    const response = await api.post("/login", {
      email,
      password: "password123",
    });
    accessToken = response.data.accessToken;
    refreshToken = response.data.refreshToken;
    console.log("  Access Token:", accessToken.substring(0, 20) + "...");
    console.log("  Refresh Token:", refreshToken.substring(0, 20) + "...");
  });

  await test("Get Current User", async () => {
    const response = await api.get("/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    userId = response.data.user._id;
    console.log("  User ID:", userId);
    console.log("  User Data:", response.data.user);
  });

  await test("Create Task", async () => {
    const response = await api.post(
      "/tasks",
      {
        title: "Test Task",
        description: "This is a test task",
        status: "To Do",
        Deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    taskId = response.data._id;
    console.log("  Task ID:", taskId);
    console.log("  Task Data:", response.data);
  });

  await test("Get All Tasks", async () => {
    const response = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("  Total Tasks:", response.data.length);
    console.log("  First Task:", response.data[0]);
  });

  await test("Get Task by ID", async () => {
    const response = await api.get(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("  Task:", response.data);
  });

  await test("Update Task", async () => {
    const response = await api.put(
      `/tasks/${taskId}`,
      {
        title: "Updated Task Title",
        description: "Updated description",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log("  Updated Task:", response.data);
  });

  await test("Update Task Status", async () => {
    const response = await api.put(
      `/tasks/${taskId}`,
      { status: "in-progress" },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log("  Task Status Updated:", response.data.status);
  });

  await test("Mark Task as Completed", async () => {
    const response = await api.post(
      `/tasks/${taskId}/complete`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log("  Task Completed:", response.data);
  });

  await test("Refresh Access Token", async () => {
    const response = await api.post("/refresh-token", {
      refreshToken,
    });
    accessToken = response.data.accessToken;
    console.log("  New Access Token:", accessToken.substring(0, 20) + "...");
  });

  await test("Delete Task", async () => {
    const response = await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("  Delete Response:", response.data);
  });

  await test("Logout", async () => {
    const response = await api.post("/logout", {
      refreshToken,
    });
    console.log("  Logout Response:", response.data);
  });

  await test("Test Unauthorized Access (should fail)", async () => {
    try {
      await api.get("/tasks", {
        headers: { Authorization: "Bearer invalid-token" },
      });
    } catch (error) {
      console.log("  Expected Error:", error.response?.data);
    }
  });

  console.log("\n" + "=".repeat(50));
  console.log("TEST SUITE COMPLETED");
  console.log("=".repeat(50));
}

runTests().catch(console.error);
