#!/usr/bin/env pwsh

$ErrorActionPreference = 'Continue'

Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "  FULL STACK INTEGRATION TEST - Backend & Frontend" -ForegroundColor Cyan
Write-Host "="*80 + "`n" -ForegroundColor Cyan

$testEmail = "test_$(Get-Random)@example.com"
$passed = 0
$failed = 0

function Test-API {
    param($name, $script)
    Write-Host "Testing: $name"
    try {
        & $script
        Write-Host "✓ PASSED`n" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ FAILED: $($_.Exception.Message)`n" -ForegroundColor Red
        return $false
    }
}

# Test 1: Register
if (Test-API "1. Register User" {
    $res = curl -s -X POST http://localhost:3000/api/register `
      -H "Content-Type: application/json" `
      -d "{`"fullName`":`"Test User`",`"email`":`"$testEmail`",`"password`":`"password123`"}"
    
    $data = $res | ConvertFrom-Json
    if ($data.message -eq "User registered successfully") {
        Write-Host "  Email: $testEmail"
    } else {
        throw "Registration failed"
    }
}) { $passed++ } else { $failed++ }

# Test 2: Login
if (Test-API "2. Login User" {
    $res = curl -s -X POST http://localhost:3000/api/login `
      -H "Content-Type: application/json" `
      -d "{`"email`":`"$testEmail`",`"password`":`"password123`"}"
    
    $data = $res | ConvertFrom-Json
    if ($data.accessToken -and $data.refreshToken) {
        $global:token = $data.accessToken
        $global:refToken = $data.refreshToken
        Write-Host "  Access Token: $($data.accessToken.Substring(0, 30))..."
    } else {
        throw "Login failed - no tokens"
    }
}) { $passed++ } else { $failed++ }

# Test 3: Get User
if (Test-API "3. Get Current User (Protected)" {
    $res = curl -s -X GET http://localhost:3000/api/user `
      -H "Authorization: Bearer $global:token"
    
    $data = $res | ConvertFrom-Json
    if ($data.user.email) {
        Write-Host "  User: $($data.user.fullName)"
        Write-Host "  Role: $($data.user.role)"
    } else {
        throw "Get user failed"
    }
}) { $passed++ } else { $failed++ }

# Test 4: Create Task
if (Test-API "4. Create Task" {
    $deadline = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    $res = curl -s -X POST http://localhost:3000/api/tasks `
      -H "Authorization: Bearer $global:token" `
      -H "Content-Type: application/json" `
      -d "{`"title`":`"Test Task`",`"description`":`"Integration test`",`"status`":`"To Do`",`"Deadline`":`"$deadline`"}"
    
    $data = $res | ConvertFrom-Json
    if ($data._id) {
        $global:taskId = $data._id
        Write-Host "  Task ID: $($data._id)"
        Write-Host "  Title: $($data.title)"
    } else {
        throw "Create task failed"
    }
}) { $passed++ } else { $failed++ }

# Test 5: Get Tasks
if (Test-API "5. Get All Tasks" {
    $res = curl -s -X GET http://localhost:3000/api/tasks `
      -H "Authorization: Bearer $global:token"
    
    $data = $res | ConvertFrom-Json
    Write-Host "  Total Tasks: $($data.Count)"
}) { $passed++ } else { $failed++ }

# Test 6: Get Task by ID
if (Test-API "6. Get Task by ID" {
    $res = curl -s -X GET http://localhost:3000/api/tasks/$global:taskId `
      -H "Authorization: Bearer $global:token"
    
    $data = $res | ConvertFrom-Json
    if ($data.title) {
        Write-Host "  Task: $($data.title)"
        Write-Host "  Status: $($data.status)"
    } else {
        throw "Get task failed"
    }
}) { $passed++ } else { $failed++ }

# Test 7: Update Task
if (Test-API "7. Update Task" {
    $res = curl -s -X PUT http://localhost:3000/api/tasks/$global:taskId `
      -H "Authorization: Bearer $global:token" `
      -H "Content-Type: application/json" `
      -d "{`"title`":`"Updated Task`"}"
    
    $data = $res | ConvertFrom-Json
    if ($data.title -eq "Updated Task") {
        Write-Host "  Title Updated: $($data.title)"
    } else {
        throw "Update task failed"
    }
}) { $passed++ } else { $failed++ }

# Test 8: Delete Task
if (Test-API "8. Delete Task" {
    $res = curl -s -X DELETE http://localhost:3000/api/tasks/$global:taskId `
      -H "Authorization: Bearer $global:token"
    
    $data = $res | ConvertFrom-Json
    if ($data.message -like "*deleted*") {
        Write-Host "  Task deleted successfully"
    } else {
        throw "Delete task failed"
    }
}) { $passed++ } else { $failed++ }

# Test 9: Frontend
if (Test-API "9. Frontend Server Accessible" {
    $res = curl -s -X GET http://localhost:3000
    if ($res.Length -gt 0) {
        Write-Host "  Frontend loaded successfully"
    } else {
        throw "Frontend not accessible"
    }
}) { $passed++ } else { $failed++ }

Write-Host "="*80 -ForegroundColor Cyan
Write-Host "  RESULTS: $passed PASSED | $failed FAILED" -ForegroundColor Cyan
Write-Host "="*80 + "`n" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "✓✓✓ ALL TESTS PASSED - Full Stack is Working! ✓✓✓`n" -ForegroundColor Green
} else {
    Write-Host "✗ $failed test(s) failed`n" -ForegroundColor Red
}
