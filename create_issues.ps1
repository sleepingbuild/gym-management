$repo = "sleepingbuild/gym-management"

$data = Get-Content .\issues.json -Raw | ConvertFrom-Json

foreach ($phase in $data.phases) {

```
Write-Host ""
Write-Host "====================================="
Write-Host "CREATING PHASE:" $phase.phase
Write-Host "====================================="
Write-Host ""

foreach ($issue in $phase.issues) {

    $labels = $issue.labels -join ","

    $descriptionText = ""

    if ($issue.description) {
        $descriptionText = ($issue.description | ConvertTo-Json -Depth 10)
    }

    $body = @"
```

# Phase

$($phase.phase)

# Priority

$($issue.priority)

# Description

$descriptionText

# Global Rules

* Khong hardcode API URLs
* Khong duplicate business logic
* Khong duplicate components
* Tat ca APIs phai co validation
* Tat ca AI agents phai doc ky codebase truoc khi code
  "@

  ```
    gh issue create `
        --repo $repo `
        --title $issue.title `
        --body $body `
        --label $labels
  ```

  }
  }
