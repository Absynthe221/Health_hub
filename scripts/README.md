# User Module Assignment Script

This script reads a CSV file containing user information and assigns role-based training modules to users via the Health Hub API.

## Features

- **CSV Import**: Reads user data from CSV files
- **Role-Based Assignment**: Automatically assigns modules based on user roles
- **API Integration**: Updates user data via the Health Hub API
- **Progress Tracking**: Maintains existing progress while updating assignments
- **Error Handling**: Comprehensive error handling and logging
- **Batch Processing**: Processes multiple users efficiently

## Prerequisites

1. Health Hub server running on `http://localhost:3000`
2. Node.js dependencies installed (`csv-parser`, `node-fetch`)
3. CSV file with user data in the correct format

## CSV Format

The CSV file should have the following columns:

```csv
UserID,FirstName,LastName,Email,Role,AssignedModules
001,John,Doe,john.doe@example.com,all,health-safety;fire-safety
002,Jane,Smith,jane.smith@example.com,childcare,health-safety;fire-safety;safeguarding-children
```

### Required Columns:
- `UserID`: Unique identifier for the user
- `FirstName`: User's first name
- `LastName`: User's last name
- `Email`: User's email address
- `Role`: User's role (all, childcare, food-prep, dementia, learning-disability, medication)
- `AssignedModules`: Semicolon-separated list of module IDs (optional, will be auto-assigned based on role)

## Usage

### 1. Prepare CSV File

Create a CSV file named `user-role-assignments.csv` in the project root with your user data.

### 2. Run the Script

```bash
# Using npm script (recommended)
npm run assign-modules

# Or directly with node
node scripts/user-module-assignment.js
```

### 3. Monitor Output

The script will:
- Read the CSV file
- Process each user
- Assign role-based modules
- Create new users or update existing ones
- Display progress and results

## Module Mapping

The script automatically assigns modules based on user roles:

| Role | Modules Assigned |
|------|------------------|
| `all` | 14 core modules (all staff) |
| `childcare` | 15 modules (includes safeguarding-children) |
| `food-prep` | 15 modules (includes food-hygiene) |
| `dementia` | 15 modules (includes dementia-awareness) |
| `learning-disability` | 15 modules (includes learning-disability) |
| `medication` | 15 modules (includes medication-awareness) |

## API Endpoints Used

- `GET /api/users?userID={id}` - Check if user exists
- `POST /api/users` - Create new user
- `PUT /api/users` - Update existing user

## Error Handling

The script handles various error scenarios:
- Missing CSV file
- Invalid CSV format
- API connection errors
- User creation/update failures
- Network timeouts

## Output

The script provides detailed logging:
- ✅ Success messages for each user processed
- ❌ Error messages for failed operations
- 📊 Summary table with results
- 📈 Success rate statistics

## Example Output

```
🚀 Health Hub User Module Assignment Script
============================================

📥 Reading CSV file: ./user-role-assignments.csv
📥 Loaded 6 users from CSV.
🔄 Starting module assignment process...

✅ Created user John Doe (all) with 14 modules
✅ Updated user Jane Smith (childcare) with 15 modules
✅ Created user Bob Johnson (food-prep) with 15 modules
✅ Updated user Alice Williams (dementia) with 15 modules
✅ Created user Tom Brown (learning-disability) with 15 modules
✅ Updated user Linda Davis (medication) with 15 modules

🏁 Module assignment complete!

📊 Summary:
┌─────────┬─────────────────┬────────┬──────────────┬─────────┬─────────┐
│ (index) │      user       │ action │     role     │ modules │ status  │
├─────────┼─────────────────┼────────┼──────────────┼─────────┼─────────┤
│    0    │   'John Doe'    │ created│     'all'    │   14    │ success │
│    1    │  'Jane Smith'   │ updated│  'childcare' │   15    │ success │
└─────────┴─────────────────┴────────┴──────────────┴─────────┴─────────┘

✅ Successful: 6
❌ Failed: 0
📈 Success Rate: 100%
```

## Troubleshooting

### Common Issues

1. **CSV file not found**
   - Ensure `user-role-assignments.csv` exists in the project root
   - Check file path and permissions

2. **API connection errors**
   - Verify Health Hub server is running on port 3000
   - Check network connectivity

3. **Invalid role errors**
   - Ensure roles match: all, childcare, food-prep, dementia, learning-disability, medication
   - Check for typos in CSV data

4. **Module assignment failures**
   - Verify training modules exist in the system
   - Check API endpoint availability

### Debug Mode

For detailed debugging, you can modify the script to include more verbose logging or add console.log statements at key points.

## Security Notes

- The script runs locally and connects to localhost
- No sensitive data is logged (passwords, etc.)
- CSV files should be handled securely in production environments
- Consider using environment variables for API URLs in production
