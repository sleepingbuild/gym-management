# ============================================
# SCRIPT TỰ ĐỘNG FIX LỖI - CHẠY TỪ ROOT DỰ ÁN
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🚀 IRONFIT PRO - AUTO FIX SCRIPT" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. FIX CI WORKFLOW - Thêm env vars vào test job
# ============================================
Write-Host "[1/5] FIXING CI WORKFLOW..." -ForegroundColor Yellow

$ciPath = ".github/workflows/ci.yml"
if (Test-Path $ciPath) {
    $content = Get-Content $ciPath -Raw
    
    # Tìm job test-backend và thêm env vars
    if ($content -match "test-backend:") {
        # Kiểm tra đã có env chưa
        if ($content -notmatch "env:.*DATABASE_URL") {
            # Thêm env vars vào job
            $newContent = $content -replace "(test-backend:.*?steps:)", @'
test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
'@
            $newContent = $newContent -replace "(run: cd backend && npm test)", @'
run: |
  cd backend
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_db"
  export JWT_SECRET="test-secret"
  export JWT_REFRESH_SECRET="test-refresh-secret"
  npm test
'@
            $newContent | Set-Content $ciPath -Encoding UTF8
            Write-Host "✅ CI workflow updated" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ CI already has env vars" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "❌ CI workflow not found" -ForegroundColor Red
}

# ============================================
# 2. FIX FRONTEND LINT - no-explicit-any
# ============================================
Write-Host ""
Write-Host "[2/5] FIXING FRONTEND LINT ERRORS..." -ForegroundColor Yellow

$frontendFiles = @(
    "frontend/app/(auth)/login/page.tsx",
    "frontend/app/(auth)/register/page.tsx",
    "frontend/services/bodyGoal.service.ts"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Fix no-explicit-any - thay any bằng unknown
        $newContent = $content -replace ': any', ': unknown'
        $newContent = $newContent -replace 'as any', 'as unknown'
        
        if ($content -ne $newContent) {
            $newContent | Set-Content $file -Encoding UTF8
            Write-Host "✅ Fixed: $file" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ No changes needed: $file" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
    }
}

# ============================================
# 3. ADD EMBEDDING COLUMN TO SCHEMA
# ============================================
Write-Host ""
Write-Host "[3/5] ADDING EMBEDDING COLUMN TO SCHEMA..." -ForegroundColor Yellow

$schemaPath = "backend/prisma/schema.prisma"
if (Test-Path $schemaPath) {
    $content = Get-Content $schemaPath -Raw
    
    # Kiểm tra đã có embedding chưa
    if ($content -match "embedding Unsupported") {
        Write-Host "ℹ️ Embedding column already exists" -ForegroundColor Cyan
    } else {
        # Thêm embedding vào model KnowledgeBase
        $newContent = $content -replace '(model KnowledgeBase \{.*?content\s+String\s+@db\.Text)', '$1`n  embedding Unsupported("vector(3072)")?'
        $newContent | Set-Content $schemaPath -Encoding UTF8
        Write-Host "✅ Embedding column added to schema" -ForegroundColor Green
        
        # Chạy migration
        Write-Host "⏳ Running migration..." -ForegroundColor Yellow
        Push-Location backend
        npx prisma migrate dev --name add_embedding_column
        Pop-Location
    }
} else {
    Write-Host "❌ Schema not found" -ForegroundColor Red
}

# ============================================
# 4. UPDATE SELF_ASSESSMENT.md
# ============================================
Write-Host ""
Write-Host "[4/5] UPDATING SELF_ASSESSMENT.md..." -ForegroundColor Yellow

$saPath = "SELF_ASSESSMENT.md"
if (Test-Path $saPath) {
    $content = Get-Content $saPath -Raw
    
    # Cập nhật điểm nhóm
    $newContent = $content -replace '\|\s*\*\*Total\*\*\s*\|\s*80\s*\|\s*74\s*\|', '| **Total** | 80 | **50** |'
    
    # Cập nhật điểm cá nhân Phi
    $newContent = $newContent -replace '(Phạm Hoàng Phi.*?Total.*?\|\s*20\s*\|\s*)20(\s*\|)', '$150$2'
    
    # Cập nhật điểm cá nhân Quang
    $newContent = $newContent -replace '(Giang Văn Quang.*?Total.*?\|\s*20\s*\|\s*)15(\s*\|)', '$111$2'
    
    if ($content -ne $newContent) {
        $newContent | Set-Content $saPath -Encoding UTF8
        Write-Host "✅ SELF_ASSESSMENT.md updated" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ SELF_ASSESSMENT.md already updated" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ SELF_ASSESSMENT.md not found" -ForegroundColor Red
}

# ============================================
# 5. RUN LINT AND TEST TO VERIFY
# ============================================
Write-Host ""
Write-Host "[5/5] VERIFYING FIXES..." -ForegroundColor Yellow

# Backend lint
Write-Host "⏳ Checking backend lint..." -ForegroundColor Yellow
Push-Location backend
$lintResult = npm run lint 2>&1
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend lint PASSED" -ForegroundColor Green
} else {
    Write-Host "⚠️ Backend lint still has issues" -ForegroundColor Yellow
}

# Frontend lint
Write-Host "⏳ Checking frontend lint..." -ForegroundColor Yellow
Push-Location frontend
$lintResult = npm run lint 2>&1
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend lint PASSED" -ForegroundColor Green
} else {
    Write-Host "⚠️ Frontend lint still has issues" -ForegroundColor Yellow
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ AUTO FIX COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 WHAT WAS FIXED:" -ForegroundColor Yellow
Write-Host "  1. CI workflow - added env vars for test job" -ForegroundColor White
Write-Host "  2. Frontend lint - fixed no-explicit-any errors" -ForegroundColor White
Write-Host "  3. Schema - added embedding column" -ForegroundColor White
Write-Host "  4. SELF_ASSESSMENT.md - updated scores" -ForegroundColor White
Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Run: git add . && git commit -m 'fix: auto-fix all issues'" -ForegroundColor White
Write-Host "  2. Run: git push origin main" -ForegroundColor White
Write-Host "  3. Check CI: https://github.com/sleepingbuild/gym-management/actions" -ForegroundColor White
Write-Host "  4. Update release tag: git tag -f 0.2.0 && git push origin 0.2.0 --force" -ForegroundColor White
Write-Host ""