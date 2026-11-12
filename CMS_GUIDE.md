# 웹 포트폴리오 관리 안내

## 첫 연결

1. https://app.pagescms.org 에서 GitHub 계정으로 로그인합니다.
2. Pages CMS GitHub App 설치를 승인하되 `Only select repositories`로 `portal-intro`만 선택합니다.
3. `hoodie5622/portal-intro` → `main` → `포트폴리오 작품 관리`를 엽니다.
4. 기존 작품 4개가 보이는지 확인하고, 시험용 문구 하나를 고쳐 저장합니다.
5. GitHub의 새 커밋과 Pages 배포 성공을 확인하고 공개 화면을 새로고침합니다.

이 구성은 외부 로그인형 CMS입니다. 포트폴리오 화면 자체에 비밀번호·API 토큰을 넣지 않습니다.
‘작품 관리’ 링크는 편집기로 이동할 뿐 편집 권한을 부여하지 않습니다.

## 매번 사용하는 방법

작품 목록에 항목을 추가하거나 기존 작품을 펼쳐 이름·설명·주소·사용 기술·이미지를 편집합니다.
이미지는 업로드 또는 선택합니다. 완료하면 Save/저장을 누릅니다.
저장되지 않은 입력은 공개되지 않습니다. 저장된 내용의 배포 성공 이후 사이트에 반영됩니다.
작품 삭제는 항목 삭제 후 저장으로 적용됩니다. 같은 이미지가 다른 작품에서 사용 중이면 삭제하지 않습니다.
현재 설명의 내용(예: CodeLog 문구)은 이전 값을 그대로 옮겼으므로 실제 작품에 맞게 편집하세요.

## 기준 원본과 안전

웹 편집 이후에는 GitHub main의 `portfolio.json`과 assets가 기준 원본입니다.
옛 `portfolio-data.js` 또는 로컬 사본을 다시 업로드하면 안 됩니다.
코드 수정이 필요할 때만 작업 폴더에서 변경 없는 상태를 확인하고 `git pull --ff-only origin main`으로 최신 내용을 받습니다.
다른 작업과 충돌하면 강제 push/reset을 하지 않습니다.
CMS 백업은 개인 포털의 localStorage 백업이 아닙니다. 개인 일정과 공부 기록은 이전 백업 기능을 사용합니다.

## 이미지 경로

`.pages.yml`은 이미지를 assets에 저장하고 `assets/파일명` 경로를 기록합니다.
배포는 /portal-intro/ 경로, 로컬은 / 또는 /public-site/ 경로에서 표시할 수 있게 했습니다.
PNG/JPG/JPEG/WebP/AVIF를 지원합니다. 깨진 이미지는 준비 중 안내로 대체합니다.
실명·학교명·연락처가 보이는 캡처는 올리지 마세요.

## 검증 구분

이 안내는 전환 파일에 대한 설명입니다. 실제 Pages CMS 로그인, App 승인, 저장 커밋, 공개 배포를 대신 수행했다는 뜻은 아닙니다.
저장소 연결은 소유자가 승인해야 하며, 사이트 반영은 Pages 배포 결과로 확인해야 합니다.

## 공식 자료

- https://pagescms.org/docs/quick-start/
- https://pagescms.org/docs/configuration/
- https://pagescms.org/docs/configuration/content/list/
- https://pagescms.org/docs/configuration/media/
- https://pagescms.org/docs/configuration/settings/
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
