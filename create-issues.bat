@echo off
title GYM MANAGEMENT ENTERPRISE ISSUE SYSTEM

echo ==================================================
echo CREATING LABELS
echo ==================================================

gh label create "backend" --color FF5733 --description "Backend related tasks"
gh label create "frontend" --color 33C1FF --description "Frontend related tasks"
gh label create "mobile" --color C700FF --description "Mobile application tasks"
gh label create "database" --color FFC300 --description "Database related tasks"
gh label create "auth" --color FF33A8 --description "Authentication tasks"
gh label create "ai" --color 33FF57 --description "AI related tasks"
gh label create "testing" --color 808080 --description "Testing tasks"
gh label create "deployment" --color 000000 --description "Deployment tasks"
gh label create "ui/ux" --color F39C12 --description "UI UX tasks"
gh label create "enhancement" --color 2ECC71 --description "Enhancement tasks"
gh label create "security" --color E74C3C --description "Security related tasks"
gh label create "high priority" --color FF0000 --description "Critical priority task"

echo ==================================================
echo CREATING MILESTONES
echo ==================================================

gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 1 - Project Setup"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 2 - Authentication & Database"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 3 - Membership & AI"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 4 - Frontend Dashboard"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 5 - Mobile Application"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 6 - Payment & Notification"
gh api repos/sleepingbuild/gym-management/milestones -f title="Phase 7 - Testing & Deployment"

echo ==================================================
echo ISSUE #1
echo ==================================================

gh issue create ^
--title "[Issue #1][Setup] Khoi tao repository structure va workflow" ^
--label "high priority" ^
--body "## Muc tieu
Khoi tao cau truc repository chuyen nghiep cho du an Gym Management System.

## Cong viec can lam

* Setup branch strategy
* Setup README.md
* Setup .gitignore
* Setup pull request template
* Setup issue templates
* Setup coding convention
* Setup folder architecture
* Setup environment variables convention

## Branch Rules

* main
* develop
* feature/*
* hotfix/*

## Checklist

* [ ] Tao README
* [ ] Tao .gitignore
* [ ] Tao branch develop
* [ ] Setup pull request template
* [ ] Setup issue templates

## Deliverables

* Repository structure hoan chinh
* Team workflow ro rang

## Important Rules

* Khong push truc tiep vao main
* Moi feature phai qua pull request
* Tat ca code assistant phai doc ky repository structure truoc khi tao file moi de tranh duplicate architecture."

echo ==================================================
echo ISSUE #2
echo ==================================================

gh issue create ^
--title "[Issue #2][Backend] Setup NodeJS + TypeScript Backend" ^
--label "backend,high priority" ^
--body "## Muc tieu
Khoi tao backend cho he thong gym management.

## Cong nghe

* NodeJS
* ExpressJS hoac NestJS
* TypeScript

## Folder Structure

src/
├── controllers
├── routes
├── services
├── middlewares
├── validators
├── prisma
├── config
├── utils

## Tasks

* Setup TypeScript
* Setup dotenv
* Setup eslint
* Setup prettier
* Setup nodemon
* Setup logger
* Setup global error handling

## API Test

GET /api/health

## Checklist

* [ ] Backend run thanh cong
* [ ] API health check hoat dong
* [ ] Logger hoat dong
* [ ] Error handling middleware hoat dong

## Deliverables

* Backend architecture on dinh

## Important Rules

Tat ca AI agents va code assistants phai doc ky backend architecture, middleware va routing truoc khi them module moi de tranh routing conflict hoac duplicate services."

echo ==================================================
echo ISSUE #3
echo ==================================================

gh issue create ^
--title "[Issue #3][Database] Setup PostgreSQL va Prisma ORM" ^
--label "database,backend,high priority" ^
--body "## Muc tieu
Setup database system cho du an.

## Cong viec can lam

* Setup PostgreSQL
* Setup Prisma ORM
* Setup migration system
* Setup seed system
* Setup database connection

## Checklist

* [ ] PostgreSQL connect thanh cong
* [ ] Prisma init thanh cong
* [ ] Migration hoat dong
* [ ] Seed data hoat dong

## Deliverables

* Database system hoat dong on dinh

## Important Rules

* Khong sua schema truc tiep tren database
* Tat ca thay doi phai thong qua migration
* AI agents phai doc ky schema truoc khi sua relation."

echo ==================================================
echo ISSUE #4
echo ==================================================

gh issue create ^
--title "[Issue #4][Database] Thiet ke Users schema va Roles" ^
--label "database,backend" ^
--body "## Tables

### Users

* id
* fullName
* email
* password
* avatar
* role
* phone
* createdAt
* updatedAt

### Roles

* ADMIN
* STAFF
* MEMBER
* PT

## Tasks

* Tao Prisma schema
* Tao migration
* Setup relations
* Setup indexes

## Checklist

* [ ] Users schema hoan thanh
* [ ] Roles setup dung
* [ ] Migration thanh cong

## Important Rules

Tat ca agents phai doc ky relation hien tai truoc khi sua schema de tranh conflict database."

echo ==================================================
echo ISSUE #5
echo ==================================================

gh issue create ^
--title "[Issue #5][Auth] Xay dung Register API" ^
--label "backend,auth,security,high priority" ^
--body "## API
POST /api/auth/register

## Validation

* Email hop le
* Password >= 8 ky tu
* Khong duplicate email

## Logic

* Hash password bang bcrypt
* Tao JWT token
* Luu user vao database

## Checklist

* [ ] Validation hoat dong
* [ ] Password hashing hoat dong
* [ ] JWT generate thanh cong
* [ ] Duplicate email duoc chan

## Deliverables

* User dang ky thanh cong

## Important Rules

* Khong luu plain text password
* Tat ca auth code phai co validation
* AI agents phai doc ky auth flow truoc khi sua authentication logic."

echo ==================================================
echo ISSUE #6
echo ==================================================

gh issue create ^
--title "[Issue #6][Auth] Xay dung Login API va JWT System" ^
--label "backend,auth,security,high priority" ^
--body "## API
POST /api/auth/login

## Logic

* Verify password
* Generate access token
* Generate refresh token

## Security Requirements

* JWT expiration
* Secure refresh token
* Error handling

## Checklist

* [ ] Login thanh cong
* [ ] JWT hoat dong
* [ ] Refresh token hoat dong
* [ ] Error handling day du

## Important Rules

Tat ca AI agents phai doc ky auth middleware va token structure truoc khi chinh sua de tranh pha vo authentication system."

echo ==================================================
echo ISSUE #7
echo ==================================================

gh issue create ^
--title "[Issue #7][Auth] Middleware Authentication va Authorization" ^
--label "backend,auth,security" ^
--body "## Middleware can lam

* Verify JWT
* Role authorization
* Error middleware

## Roles

* ADMIN
* STAFF
* MEMBER
* PT

## Checklist

* [ ] JWT verify middleware
* [ ] Role middleware
* [ ] Unauthorized handling

## Deliverables

* Route protection hoat dong dung

## Important Rules

Khong duplicate auth middleware. Agents phai doc middleware structure truoc khi them middleware moi."

echo ==================================================
echo CONTINUE ADDING ISSUE #8 -> ISSUE #30 ...
echo ==================================================

echo Script base enterprise da duoc tao.
echo Hay tiep tuc them Issue #8 -> #30 theo cung format enterprise nay.

pause
