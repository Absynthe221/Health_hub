# Git Workflow Guide - Health Hub ECG Platform

## 🚀 Repository Setup

### 1. Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**
```bash
# Authenticate with GitHub
gh auth login

# Create repository and push
gh repo create health_hub --public --push --source=.
```

**Option B: Manual Setup**
```bash
# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/health_hub.git
git branch -M main
git push -u origin main
```

### 2. Verify Setup
```bash
git remote -v
git status
git log --oneline
```

## 🌟 Feature Branch Workflow

### Creating Features
```bash
# Create and switch to feature branch
git checkout -b feat/add-new-feature

# Make changes, then commit
git add .
git commit -m "feat: add new feature description"

# Push feature branch
git push -u origin feat/add-new-feature

# Create PR on GitHub, merge after CI passes
```

### Common Feature Types
```bash
# New features
git checkout -b feat/user-authentication
git checkout -b feat/ecg-upload

# Bug fixes
git checkout -b fix/dashboard-loading
git checkout -b fix/api-error-handling

# Documentation
git checkout -b docs/api-documentation
git checkout -b docs/deployment-guide

# Testing
git checkout -b test/add-integration-tests
git checkout -b test/improve-coverage
```

## 🔧 Conflict Resolution

### Rebase Workflow (Recommended)
```bash
# Fetch latest changes
git fetch origin

# Rebase your feature branch
git checkout feat/your-feature
git rebase origin/main

# Resolve conflicts if any
# Edit conflicted files, then:
git add .
git rebase --continue

# Force push (safe with --force-with-lease)
git push --force-with-lease
```

### Merge Workflow (Alternative)
```bash
# Merge main into feature branch
git checkout feat/your-feature
git merge origin/main

# Resolve conflicts, then:
git add .
git commit -m "resolve merge conflicts"
git push
```

## 📝 Commit Message Convention

### Format
```
type(scope): brief description

Longer description if needed

Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes
- `perf`: Performance improvements

### Examples
```bash
git commit -m "feat(auth): add role-based authentication"
git commit -m "fix(dashboard): resolve loading state issue"
git commit -m "test(api): add comprehensive API tests"
git commit -m "docs(readme): update installation instructions"
git commit -m "chore(deps): update dependencies to latest versions"
```

## 🏷️ Release Management

### Semantic Versioning
```bash
# Patch release (bug fixes)
git tag v1.0.1
git push origin v1.0.1

# Minor release (new features)
git tag v1.1.0
git push origin v1.1.0

# Major release (breaking changes)
git tag v2.0.0
git push origin v2.0.0
```

### Release Workflow
```bash
# Create release branch
git checkout -b release/v1.1.0

# Make release preparations
git add .
git commit -m "chore: prepare release v1.1.0"

# Merge to main
git checkout main
git merge release/v1.1.0

# Tag release
git tag v1.1.0
git push origin main --tags

# Clean up
git branch -d release/v1.1.0
```

## 🔍 Useful Git Commands

### Inspection
```bash
# View commit history
git log --oneline --graph

# View file changes
git diff
git diff --staged

# View branch information
git branch -a
git branch -r

# View remote information
git remote show origin
```

### Cleanup
```bash
# Clean untracked files
git clean -fd

# Reset to last commit
git reset --hard HEAD

# Remove merged branches
git branch --merged | grep -v main | xargs git branch -d
```

### Stashing
```bash
# Save current work
git stash push -m "work in progress"

# Apply stashed changes
git stash pop

# List stashes
git stash list

# Apply specific stash
git stash apply stash@{0}
```

## 🚨 Emergency Procedures

### Undo Last Commit
```bash
# Keep changes in working directory
git reset --soft HEAD~1

# Discard changes completely
git reset --hard HEAD~1
```

### Fix Pushed Commit
```bash
# Interactive rebase
git rebase -i HEAD~3

# Force push (use carefully)
git push --force-with-lease
```

### Recover Lost Work
```bash
# View reflog
git reflog

# Recover specific commit
git checkout COMMIT_HASH
git checkout -b recovery-branch
```

## 📋 Pre-commit Checklist

Before committing:
- [ ] Run tests: `npm run test`
- [ ] Run linting: `npm run lint`
- [ ] Check build: `npm run build`
- [ ] Update documentation if needed
- [ ] Write descriptive commit message
- [ ] Test your changes locally

## 🔄 CI/CD Integration

The repository includes:
- **GitHub Actions**: Automated testing and deployment
- **Vercel**: Automatic deployments on push to main
- **Lighthouse**: Performance monitoring
- **Security**: Automated vulnerability scanning

### CI Pipeline Triggers
- Push to `main`: Full pipeline + deployment
- Pull Request: Testing and validation
- Push to feature branch: Basic validation

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
