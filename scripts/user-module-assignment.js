/**
 * Cursor-ready User Module Assignment Script
 * ------------------------------------------
 * Reads a CSV file with users and roles, assigns role-based modules,
 * and updates user progress via the Health Hub API.
 */

import fs from "fs";
import csv from "csv-parser";
import fetch from "node-fetch";

// -------------------- CONFIGURATION --------------------
const CSV_FILE_PATH = "./user-role-assignments.csv"; // Update path if needed
const API_BASE_URL = "http://localhost:3000/api/users"; // API endpoint

// Module mapping based on training program structure
const MODULE_MAPPING = {
  "all": [
    "health-safety",
    "fire-safety", 
    "manual-handling",
    "infection-control",
    "safeguarding-adults",
    "equality-diversity",
    "first-aid",
    "information-governance",
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health"
  ],
  "childcare": [
    "health-safety",
    "fire-safety",
    "manual-handling", 
    "infection-control",
    "safeguarding-adults",
    "safeguarding-children",
    "equality-diversity",
    "first-aid",
    "information-governance",
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health"
  ],
  "food-prep": [
    "health-safety",
    "fire-safety",
    "manual-handling",
    "infection-control", 
    "safeguarding-adults",
    "equality-diversity",
    "first-aid",
    "information-governance",
    "food-hygiene",
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health"
  ],
  "dementia": [
    "health-safety",
    "fire-safety",
    "manual-handling",
    "infection-control",
    "safeguarding-adults", 
    "equality-diversity",
    "first-aid",
    "information-governance",
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health",
    "dementia-awareness"
  ],
  "learning-disability": [
    "health-safety",
    "fire-safety",
    "manual-handling",
    "infection-control",
    "safeguarding-adults",
    "equality-diversity",
    "first-aid", 
    "information-governance",
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health",
    "learning-disability"
  ],
  "medication": [
    "health-safety",
    "fire-safety",
    "manual-handling",
    "infection-control",
    "safeguarding-adults",
    "equality-diversity",
    "first-aid",
    "information-governance", 
    "coshh",
    "prevent-duty",
    "mental-capacity",
    "consent-records",
    "lone-working",
    "mental-health",
    "medication-awareness"
  ]
};

// Optional: track assignment progress
const progressLog = [];

// -------------------- FUNCTIONS --------------------
async function createOrUpdateUser(user) {
  const moduleIds = MODULE_MAPPING[user.Role] || [];
  if (moduleIds.length === 0) {
    console.warn(`No modules mapped for role: ${user.Role}`);
    return;
  }

  try {
    // First, try to get existing user
    let existingUser = null;
    try {
      const getResponse = await fetch(`${API_BASE_URL}?userID=${user.UserID}`);
      const getData = await getResponse.json();
      if (getData.success && getData.users.length > 0) {
        existingUser = getData.users[0];
      }
    } catch (error) {
      // User doesn't exist, will create new one
    }

    const userData = {
      userID: user.UserID,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      role: user.Role.toLowerCase().replace(' ', '-'),
      assignedModules: moduleIds,
      progress: {
        completed: existingUser ? existingUser.progress.completed : [],
        inProgress: existingUser ? existingUser.progress.inProgress : [],
        notStarted: existingUser ? 
          moduleIds.filter(id => !existingUser.progress.completed.includes(id) && !existingUser.progress.inProgress.includes(id)) :
          moduleIds
      },
      certificates: existingUser ? existingUser.certificates : [],
      lastLogin: existingUser ? existingUser.lastLogin : null,
      status: existingUser ? existingUser.status : 'active'
    };

    let response;
    if (existingUser) {
      // Update existing user
      response = await fetch(API_BASE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.UserID,
          updates: {
            assignedModules: moduleIds,
            progress: userData.progress
          }
        })
      });
    } else {
      // Create new user
      response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    const action = existingUser ? 'Updated' : 'Created';
    console.log(`✅ ${action} user ${user.FirstName} ${user.LastName} (${user.Role}) with ${moduleIds.length} modules`);
    progressLog.push({ 
      user: `${user.FirstName} ${user.LastName}`, 
      action: action.toLowerCase(),
      role: user.Role,
      modules: moduleIds.length,
      status: "success" 
    });
  } catch (error) {
    console.error(`❌ Failed to process ${user.FirstName} ${user.LastName}:`, error.message);
    progressLog.push({ 
      user: `${user.FirstName} ${user.LastName}`, 
      action: 'failed',
      role: user.Role,
      error: error.message,
      status: "failed" 
    });
  }
}

function readCSVAndAssignModules() {
  const users = [];

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`❌ CSV file not found: ${CSV_FILE_PATH}`);
    console.log("📝 Please create a CSV file with the following columns:");
    console.log("   UserID,FirstName,LastName,Email,Role,AssignedModules");
    console.log("   Example:");
    console.log("   001,John,Doe,john.doe@example.com,all,health-safety;fire-safety");
    return;
  }

  console.log(`📥 Reading CSV file: ${CSV_FILE_PATH}`);
  
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      users.push(row);
    })
    .on("end", async () => {
      console.log(`📥 Loaded ${users.length} users from CSV.`);
      console.log("🔄 Starting module assignment process...\n");
      
      for (const user of users) {
        await createOrUpdateUser(user);
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log("\n🏁 Module assignment complete!");
      console.log("\n📊 Summary:");
      console.table(progressLog);
      
      const successCount = progressLog.filter(log => log.status === 'success').length;
      const failCount = progressLog.filter(log => log.status === 'failed').length;
      
      console.log(`\n✅ Successful: ${successCount}`);
      console.log(`❌ Failed: ${failCount}`);
      console.log(`📈 Success Rate: ${Math.round((successCount / progressLog.length) * 100)}%`);
    })
    .on("error", (error) => {
      console.error("❌ Error reading CSV file:", error.message);
    });
}

// -------------------- EXECUTION --------------------
console.log("🚀 Health Hub User Module Assignment Script");
console.log("============================================\n");
readCSVAndAssignModules();
