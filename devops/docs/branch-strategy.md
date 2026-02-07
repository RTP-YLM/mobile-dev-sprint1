# Git Branch Strategy

## Branch Model: GitHub Flow + Environment Branches

```
main (production)
├── develop (staging)
│   ├── feature/user-authentication
│   ├── feature/payment-integration
│   ├── bugfix/login-issue
│   └── hotfix/critical-security-fix
```

## Branch Types

### 1. **main** - Production Branch
- **Protected**: Requires PR approval + passing CI
- **Auto-deploy**: To production environment
- **Tags**: Semantic versioning (v1.0.0, v1.1.0, etc.)
- **Merge from**: develop (via PR) or hotfix branches

### 2. **develop** - Staging Branch
- **Protected**: Requires PR approval + passing CI
- **Auto-deploy**: To staging environment
- **Testing**: Integration testing happens here
- **Merge from**: feature branches

### 3. **feature/** - Feature Development
- **Naming**: `feature/short-description` (e.g., `feature/user-profile`)
- **Branch from**: develop
- **Merge to**: develop
- **Lifespan**: Delete after merge
- **CI**: Runs lint, test, build

### 4. **bugfix/** - Bug Fixes
- **Naming**: `bugfix/issue-description` (e.g., `bugfix/login-error`)
- **Branch from**: develop
- **Merge to**: develop
- **Lifespan**: Delete after merge

### 5. **hotfix/** - Critical Production Fixes
- **Naming**: `hotfix/critical-issue` (e.g., `hotfix/security-patch`)
- **Branch from**: main
- **Merge to**: main AND develop
- **Auto-deploy**: To production after approval
- **Urgency**: Bypass normal flow for critical issues

## Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Develop and commit
git add .
git commit -m "feat: add user authentication"

# 3. Push and create PR
git push origin feature/my-feature
# Open PR: feature/my-feature → develop
```

### Release to Production
```bash
# 1. Ensure develop is tested on staging
# 2. Create PR: develop → main
# 3. Get approval
# 4. Merge (squash or merge commit)
# 5. Tag release
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Hotfix
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Fix and test
git commit -m "fix: security vulnerability"

# 3. Create PR to main
git push origin hotfix/security-patch
# PR: hotfix/security-patch → main

# 4. After merge to main, merge to develop
git checkout develop
git merge main
git push origin develop
```

## PR Requirements

### All PRs must have:
✅ Passing CI (lint, test, build)
✅ At least 1 approval (2 for production)
✅ Up-to-date with target branch
✅ Descriptive title and description
✅ Linked issue (if applicable)

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Hotfix
- [ ] Documentation

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add JWT authentication
fix(api): resolve null pointer exception
docs(readme): update installation steps
```

## Protected Branch Rules

### main
- Require pull request reviews (2)
- Require status checks to pass (CI)
- Require branches to be up to date
- Require conversation resolution
- No force pushes
- No deletions

### develop
- Require pull request reviews (1)
- Require status checks to pass (CI)
- Require branches to be up to date
- No force pushes
- No deletions
