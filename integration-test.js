const axios = require("axios");

const backendAPI = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const frontendURL = "http://localhost:3000";

let accessToken = "";
let refreshToken = "";

async function test(name, fn) {
  try {
    console.log(`✓ Testing: ${name}`);
    await fn();
    console.log(`  ✓ PASSED\n`);
    return true;
  } catch (error) {
    console.error(`✗ FAILED: ${name}`);
    console.error(
      `  Error: ${error.response?.data?.message || error.message}\n`,
    );
    return false;
  }
}

async function runIntegrationTests() {
  console.log("\n" + "=".repeat(70));
  console.log("  FULL STACK INTEGRATION TEST - Backend & Frontend");
  console.log("=".repeat(70) + "\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Register
  if (
    await test("1. User Registration", async () => {
      const email = `test${Date.now()}@example.com`;
      const res = await backendAPI.post("/register", {
        fullName: "Test User",
        email,
        password: "password123",
      });
      if (res.status !== 201)
        throw new Error(`Expected 201, got ${res.status}`);
      console.log(`    Email: ${email}`);
      global.testEmail = email;
    })
  )
    passed++;
  else failed++;

  // Test 2: Login
  if (
    await test("2. User Login", async () => {
      const res = await backendAPI.post("/login", {
        email: global.testEmail,
        password: "password123",
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (!res.data.accessToken) throw new Error("No access token returned");
      if (!res.data.refreshToken) throw new Error("No refresh token returned");

      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken;
      console.log(`    Access Token: ${accessToken.substring(0, 30)}...`);
      console.log(`    Refresh Token: ${refreshToken.substring(0, 30)}...`);
    })
  )
    passed++;
  else failed++;

  // Test 3: Get Current User
  if (
    await test("3. Get Current User (Protected)", async () => {
      const res = await backendAPI.get("/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (!res.data.user) throw new Error("No user data returned");
      console.log(`    User: ${res.data.user.fullName}`);
      console.log(`    Role: ${res.data.user.role}`);
    })
  )
    passed++;
  else failed++;

  // Test 4: Create Task
  if (
    await test("4. Create Task", async () => {
      const res = await backendAPI.post(
        "/tasks",
        {
          title: "Integration Test Task",
          description: "This is a test task created during integration testing",
          status: "To Do",
          Deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.status !== 201)
        throw new Error(`Expected 201, got ${res.status}`);
      global.taskId = res.data._id;
      console.log(`    Task ID: ${global.taskId}`);
      console.log(`    Task Title: ${res.data.title}`);
    })
  )
    passed++;
  else failed++;

  // Test 5: Get All Tasks
  if (
    await test("5. Get All Tasks (Protected)", async () => {
      const res = await backendAPI.get("/tasks", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (!Array.isArray(res.data))
        throw new Error("Tasks not returned as array");
      console.log(`    Total Tasks: ${res.data.length}`);
    })
  )
    passed++;
  else failed++;

  // Test 6: Get Task by ID
  if (
    await test("6. Get Task by ID (Protected)", async () => {
      const res = await backendAPI.get(`/tasks/${global.taskId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (!res.data._id) throw new Error("Task ID not returned");
      console.log(`    Task: ${res.data.title}`);
      console.log(`    Status: ${res.data.status}`);
    })
  )
    passed++;
  else failed++;

  // Test 7: Update Task
  if (
    await test("7. Update Task", async () => {
      const res = await backendAPI.put(
        `/tasks/${global.taskId}`,
        {
          title: "Updated Test Task",
          description: "Updated description",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      console.log(`    Updated Title: ${res.data.title}`);
    })
  )
    passed++;
  else failed++;

  // Test 8: Update Task Status
  if (
    await test("8. Update Task Status", async () => {
      const res = await backendAPI.put(
        `/tasks/${global.taskId}`,
        {
          status: "in-progress",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      console.log(`    New Status: ${res.data.status}`);
    })
  )
    passed++;
  else failed++;

  // Test 9: Refresh Token
  if (
    await test("9. Refresh Access Token", async () => {
      const res = await backendAPI.post("/refresh-token", {
        refreshToken,
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (!res.data.accessToken)
        throw new Error("No new access token returned");
      const newToken = res.data.accessToken;
      console.log(`    New Token: ${newToken.substring(0, 30)}...`);
      accessToken = newToken;
    })
  )
    passed++;
  else failed++;

  // Test 10: Delete Task
  if (
    await test("10. Delete Task", async () => {
      const res = await backendAPI.delete(`/tasks/${global.taskId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      console.log(`    Task deleted successfully`);
    })
  )
    passed++;
  else failed++;

  // Test 11: Logout
  if (
    await test("11. User Logout", async () => {
      const res = await backendAPI.post("/logout", {
        refreshToken,
      });
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      console.log(`    Logged out successfully`);
    })
  )
    passed++;
  else failed++;

  // Test 12: Unauthorized Access (should fail)
  if (
    await test("12. Verify Token Invalidation (should fail)", async () => {
      try {
        await backendAPI.get("/tasks", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        throw new Error("Should have failed but succeeded");
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`    ✓ Correctly rejected with 401`);
        } else {
          throw error;
        }
      }
    })
  )
    passed++;
  else failed++;

  // Test 13: Frontend Load
  if (
    await test("13. Frontend Server Accessible", async () => {
      const res = await axios.get(frontendURL);
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      console.log(`    Frontend is accessible`);
    })
  )
    passed++;
  else failed++;

  console.log("=".repeat(70));
  console.log(`\n  RESULTS: ${passed} PASSED | ${failed} FAILED\n`);
  console.log("=".repeat(70) + "\n");

  if (failed === 0) {
    console.log("  ✓✓✓ ALL TESTS PASSED - Full Stack is Working! ✓✓✓\n");
    process.exit(0);
  } else {
    console.log(
      `  ✗ ${failed} test(s) failed. Please check the errors above.\n`,
    );
    process.exit(1);
  }
}

runIntegrationTests().catch((error) => {
  console.error("Fatal Error:", error);
  process.exit(1);
});
