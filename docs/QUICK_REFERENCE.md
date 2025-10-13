# 📚 Quick Reference - Where to Find Things

## 🔍 Common File Locations

### **Documentation**
- **Setup Guides** → `docs/setup/`
- **Feature Docs** → `docs/features/[feature-name]/`
- **Implementation Reports** → `docs/implementation/sections/` or `docs/implementation/summaries/`
- **Architecture Decisions** → `docs/architecture/`
- **Change History** → `docs/changelog/`

### **Testing**
- **Unit Tests** → `tests/unit/`
- **Integration Tests** → `tests/integration/`
- **E2E Tests** → `tests/e2e/`
- **Test Fixtures** → `tests/fixtures/`
- **Test Reports** → `test-results/`

### **Scripts**
- **Setup Scripts** → `scripts/setup/`
- **Database Scripts** → `scripts/database/`
- **Testing Scripts** → `scripts/testing/`
- **Deployment Scripts** → `scripts/deployment/`

### **Data & Assets**
- **Module Data** → `data/modules/`
- **ECG Samples** → `data/ecg-samples/`
- **Presentations** → `data/presentations/`
- **PDFs** → `data/pdfs/` or `pdfs/`

### **Configuration**
- **Docker Config** → `config/docker/`
- **Test Config** → `config/testing/`
- **Next.js Config** → `next.config.js` (root)
- **Tailwind Config** → `tailwind.config.js` (root)
- **Jest Config** → `jest.config.js` (root)

---

## 🎯 Quick Commands

### Find a File
```bash
# Search by name
find . -name "filename"

# Search in documentation
find docs/ -name "*.md" | grep -i "keyword"

# Search in tests
find tests/ -name "*.js" | grep -i "test-name"
```

### Run Tests
```bash
# Unit tests
npm test tests/unit/

# Integration tests
npm test tests/integration/

# Specific test
npm test tests/integration/test-admin-functionality.js
```

### Run Scripts
```bash
# Setup script
node scripts/setup/setup-api-key.js

# Database script
node scripts/database/create_23_modules.js

# Testing script
node scripts/testing/FINAL-ALL-SYSTEMS-TEST.js
```

---

## 📂 Directory Purpose

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `app/` | Next.js app directory | Pages, API routes, layouts |
| `components/` | React components | Reusable UI components |
| `contexts/` | React contexts | State management |
| `hooks/` | Custom React hooks | Reusable logic |
| `lib/` | Utility libraries | Helper functions, parsers |
| `types/` | TypeScript types | Type definitions |
| `styles/` | Global styles | CSS, Tailwind |
| `public/` | Static assets | Images, fonts |
| `prisma/` | Database | Schema, migrations |
| `data/` | Data files | JSON, CSV, samples |
| `tests/` | All tests | Unit, integration, e2e |
| `scripts/` | Utility scripts | Setup, database, testing |
| `docs/` | Documentation | Guides, reports, changelog |
| `config/` | Configuration | Docker, testing configs |

---

## 🔗 Related Documentation

- Full restructuring details: [`FOLDER_RESTRUCTURE_SUMMARY.md`](../FOLDER_RESTRUCTURE_SUMMARY.md)
- Project overview: [`README.md`](../README.md)
- Architecture decisions: [`docs/architecture/DESIGN_DECISIONS.md`](architecture/DESIGN_DECISIONS.md)

---

**Last Updated:** October 13, 2025

