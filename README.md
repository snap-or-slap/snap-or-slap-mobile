# SnapOrSlap Mobile

![Test and SonarCloud](https://github.com/snap-or-slap/snap-or-slap-mobile/actions/workflows/test.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=snap-or-slap_snap-or-slap-mobile\&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=snap-or-slap_snap-or-slap-mobile)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=snap-or-slap_snap-or-slap-mobile\&metric=coverage)](https://sonarcloud.io/summary/new_code?id=snap-or-slap_snap-or-slap-mobile)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=snap-or-slap_snap-or-slap-mobile\&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=snap-or-slap_snap-or-slap-mobile)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=snap-or-slap_snap-or-slap-mobile\&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=snap-or-slap_snap-or-slap-mobile)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=snap-or-slap_snap-or-slap-mobile\&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=snap-or-slap_snap-or-slap-mobile)

SnapOrSlap là prototype mobile application cho mô hình group habit tracking, sử dụng photo-based proof, shared accountability và social pressure theo hướng vui nhộn để giúp người dùng duy trì thói quen. Repository này chứa source code React Native, design system foundation, các màn hình chính, automated tests, GitHub Actions workflow và cấu hình SonarQube Cloud quality analysis.

---

## 1. Tổng quan dự án

SnapOrSlap chuyển các thói quen cá nhân thành social challenges. Người dùng có thể tham gia squad, hoàn thành từng habit step bằng cách gửi real photo proof, theo dõi shared hearts và cùng chịu trách nhiệm với tiến độ của cả nhóm.

Phiên bản hiện tại tập trung vào phạm vi của assignment:

* Onboarding flow
* Home screen shell với bottom navigation
* Challenges screen với ba segment: Formation, Active và History
* Friends và Profile placeholder screens
* Design system foundation
* Automated screen tests
* GitHub Actions CI workflow
* SonarQube Cloud quality analysis

---

## 2. Tech Stack

| Hạng mục                    | Công nghệ                          |
| --------------------------- | ---------------------------------- |
| Mobile Framework            | React Native                       |
| Runtime / Tooling           | Expo SDK 54                        |
| Language                    | TypeScript                         |
| Testing Framework           | Jest                               |
| React Native Testing        | @testing-library/react-native      |
| Coverage Report             | Jest Coverage / LCOV / HTML report |
| CI                          | GitHub Actions                     |
| Code Quality                | SonarQube Cloud                    |
| Deployment cho Landing Page | Vercel                             |

---

## 3. Cấu trúc repository

```txt
snap-or-slap-mobile/
├── .github/
│   └── workflows/
│       └── test.yml
├── assets/
├── docs/
│   └── ... landing page source files
├── src/
│   ├── app/
│   ├── design-system/
│   ├── features/
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── challenges/
│   │   ├── friends/
│   │   └── profile/
│   └── test-utils/
├── App.tsx
├── index.ts
├── jest.config.js
├── jest.setup.ts
├── package.json
├── package-lock.json
├── sonar-project.properties
└── tsconfig.json
```

Thư mục `docs/` chứa source code của landing page. Source code chính của mobile application nằm trong thư mục `src/`.

---

## 4. Cài đặt và chạy dự án

Cài đặt dependencies:

```bash
npm install
```

Khởi động Expo development server:

```bash
npm start
```

Chạy trên Android:

```bash
npm run android
```

Chạy trên iOS:

```bash
npm run ios
```

Chạy trên web:

```bash
npm run web
```

---

## 5. Chạy test locally

Project sử dụng Jest và React Native Testing Library để viết automated screen tests.

Chạy toàn bộ tests:

```bash
npm test
```

Chạy tests kèm coverage:

```bash
npm run test:coverage
```

Chạy tests ở CI mode:

```bash
npm run test:ci
```

Chạy TypeScript checking:

```bash
npm run typecheck
```

---

## 6. Các test files theo yêu cầu assignment

Assignment yêu cầu automated tests cho `OnboardingScreen` và `HomeScreen`.

### Onboarding Screen Tests

File:

```txt
src/features/onboarding/__tests__/OnboardingScreen.test.tsx
```

Các behaviors được kiểm tra:

* Render onboarding slide đầu tiên
* Chuyển sang slide tiếp theo sau khi bấm primary action
* Quay lại slide trước đó bằng Back
* Hoàn tất onboarding thông qua Skip
* Hoàn tất onboarding từ final slide

### Home Screen Tests

File:

```txt
src/features/home/__tests__/HomeScreen.test.tsx
```

Các behaviors được kiểm tra:

* Render `HomeScreen` thành công
* Hiển thị Challenges tab mặc định
* Chuyển sang Friends tab khi press
* Chuyển sang Profile tab khi press
* Chuyển lại Challenges tab
* Render without crashing

### Additional Challenge Screen Tests

File:

```txt
src/features/challenges/__tests__/ChallengesScreen.test.tsx
```

Các behaviors được kiểm tra:

* Render Active Challenges mặc định
* Chuyển sang Formation segment
* Chuyển sang History segment
* Chuyển lại Active segment
* Render without crashing

---

## 7. Coverage Report

Sau khi chạy:

```bash
npm run test:coverage
```

Jest sẽ generate coverage reports tại:

```txt
coverage/lcov.info
coverage/lcov-report/index.html
```

Ý nghĩa của từng file:

| File                              | Mục đích                                                 |
| --------------------------------- | -------------------------------------------------------- |
| `coverage/lcov.info`              | LCOV report được SonarQube Cloud sử dụng để đọc coverage |
| `coverage/lcov-report/index.html` | HTML coverage report để người dùng mở và xem trực tiếp   |

Thư mục `coverage/` là generated output và không nên commit lên repository.

---

## 8. GitHub Actions

CI workflow nằm tại:

```txt
.github/workflows/test.yml
```

Workflow thực hiện các bước sau:

1. Checkout repository
2. Setup Node.js
3. Install dependencies bằng `npm ci`
4. Chạy TypeScript checking
5. Chạy Jest tests kèm coverage
6. Verify coverage output
7. Upload `test-report` artifact
8. Chạy SonarQube Cloud scan

Artifact được upload có tên:

```txt
test-report
```

Artifact này chứa generated HTML coverage report, bao gồm:

```txt
index.html
```

---

## 9. SonarQube Cloud

SonarQube Cloud được cấu hình thông qua file:

```txt
sonar-project.properties
```

<!-- Project key:

```txt
snap-or-slap_snap-or-slap-mobile
```

Organization key:

```txt
snap-or-slap
``` -->

SonarQube Cloud dashboard hiển thị các quality metrics chính:

* Coverage
* Maintainability rating
* Reliability rating
* Security rating
* Quality Gate status

Coverage report được import từ:

```txt
coverage/lcov.info
```

---

## 10. Assignment Evidence Checklist

Khi nộp bài, cần chuẩn bị các evidence sau:

* SonarQube Cloud project link
* Screenshot SonarQube Cloud dashboard thể hiện:

  * Coverage percentage
  * Maintainability rating
  * Reliability rating
  * Security rating
* GitHub link tới:

  * `OnboardingScreen.test.tsx`
  * `HomeScreen.test.tsx`
* Screenshot GitHub Actions thể hiện:

  * `test.yml` workflow đã chạy thành công
  * `test-report` artifact tồn tại
  * artifact có file `index.html`
* README screenshot hoặc repository link thể hiện:

  * hướng dẫn chạy test locally
  * GitHub Actions badge
  * SonarQube Cloud badges

---

## 11. Useful Commands

```bash
# Install dependencies
npm install

# Start app
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Type-check project
npm run typecheck
```

---

## 12. Notes

* Không commit `node_modules/`.
* Không commit `coverage/`.
* `package.json` và `package-lock.json` cần được commit cùng nhau khi thay đổi dependencies hoặc scripts.
* GitHub Actions sử dụng `npm ci`, vì vậy `package-lock.json` phải luôn đồng bộ với `package.json`.
* SonarQube Cloud đọc Jest coverage thông qua file `coverage/lcov.info`.
