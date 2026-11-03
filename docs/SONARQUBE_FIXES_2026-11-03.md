# SonarQube fixes — 2026-11-03

Project: `ERP-hospital`  
Baseline: `f72d794c4fe0009ed63417f980780e23e1df8678`

## ผลที่ยืนยันจาก server

- Issue ที่ยังไม่ resolved: **803 → 0**
- Background task: `84b736fb-65b1-4674-ad3d-ac55154bcb20` — `SUCCESS`
- สแกนครอบคลุม `src` ทั้งหมด 130 ไฟล์ โดยไม่ได้ปิดกฎหรือเพิ่มข้อยกเว้นไฟล์ source
- ไม่ได้เปลี่ยนสถานะ issue ด้วยมือ ผลเป็นการวิเคราะห์โค้ดใหม่ของ SonarQube

Quality Gate ยังเป็น `ERROR` ด้วยสองเงื่อนไขที่แยกจากรายการ issue:

| เงื่อนไข | ผลล่าสุด | เกณฑ์ |
| --- | --- | --- |
| New coverage | 0% | อย่างน้อย 80% |
| New duplicated lines | 5.17% | ไม่เกิน 3% |
| New violations | 0 | ต้องเป็น 0 |

ชุดตรวจเทียบด้านล่างไม่ได้ส่งรายงาน LCOV เข้า SonarQube จึงไม่ใช่หลักฐานว่า coverage ผ่านเกณฑ์

## สิ่งที่แก้

| ปัญหา | การแก้ | ไฟล์หลัก |
| --- | --- | --- |
| ปุ่มไม่มี type และ label ไม่ผูกกับ control | ระบุ action button เป็น `type="button"`; ผูก `htmlFor`/`id` ด้วย `useId`; ใช้ข้อความทั่วไปแทน label สำหรับหัวข้อที่ไม่มีช่องกรอก | `src/app/**/page.tsx` |
| ใช้ index เป็น key ของแถวที่แก้ไขได้ | เพิ่มรหัสของแถวตั้งแต่สร้าง โดยไม่ผูกกับสินค้าที่ผู้ใช้เลือก; แถวข้อมูลใช้รหัสจริง | `src/lib/form-row.ts`, หน้าจัดซื้อและคลัง |
| การ์ดและเมนูเข้าถึงด้วยคีย์บอร์ดไม่ได้ | ใช้ปุ่มจริงสำหรับพื้นที่กด, checkbox/label สำหรับเลือกรายการ, native dialog สำหรับ Sidebar บนจอเล็ก | `src/app/page.tsx`, `src/components/layout`, หน้า HR/จัดซื้อ |
| เงื่อนไขซ้อนและฟังก์ชันซับซ้อน | แยกฟังก์ชันแสดงสถานะ, modal, KPI, API รายงานและอนุมัติ; ใช้ options ที่มีชื่อและ type สำหรับ render helper ที่รับหลายค่า | หน้าระบบงาน, `src/app/api/approvals/route.ts`, `src/app/api/reports/route.ts` |
| Context สร้าง value ใหม่ทุก render | ใช้ `useCallback` และ `useMemo` พร้อม dependencies ตามค่าที่อ่านจริง | `src/context/AppContext.tsx`, `BudgetContext.tsx`, `HRContext.tsx` |
| งานสต็อกมีเงื่อนไขซ้อนหลายระดับ | แยกการปรับ PO/PR, การตัด Lot ของใบเบิก และการลดสต็อกจากใบปรับยอด โดยใช้ type ของ Prisma | `src/lib/stock-service.ts` |
| Prisma fallback ซับซ้อนและมี catch ว่าง | แยกการตรวจไฟล์/คัดลอกฐานข้อมูลตัวอย่าง และบันทึกเหตุขัดข้อง | `src/lib/prisma.ts` |
| import/ตัวแปรไม่ได้ใช้ และรูปแบบตัวเลข | ลบส่วนที่ไม่ได้ใช้, ใช้ `Number.parseInt`/`Number.parseFloat`, ลด union ที่ถูก `any` ครอบ, props แบบ readonly | ไฟล์ที่ SonarQube รายงาน |
| คำสั่ง scan ระบุ sources ไม่ครบรูปแบบ | ใช้ binary ที่ติดตั้งในโปรเจ็กต์และ `-Dsonar.sources=src` | `package.json` |

## การตรวจสอบ

- `npx.cmd tsc --noEmit --incremental false --noUnusedLocals --pretty false` ผ่าน
- `npm.cmd run build` ผ่าน โดยสร้าง static pages ครบ 69 หน้า
- `git diff --check` ผ่าน
- ตรวจเทียบ API รายงาน/อนุมัติ **31 กรณี** กับ baseline: response, HTTP status, query/filter, ลำดับข้อมูล และ error handling ตรงกัน
- ตรวจเทียบ stock service **24 กรณี** กับ baseline: ลำดับคำสั่ง transaction, การตัด Lot, ยอด movement, การอัปเดต PO/PR และ audit ตรงกัน
- ตรวจเทียบ helper แสดงผล **704 กรณี ใน 32 ฟังก์ชัน** กับ expression เดิม: ข้อความสถานะ, สี และ fallback ตรงกัน
- สคริปต์ตรวจเทียบและ snapshot ของ SonarQube อยู่ใน `.local-backups/sonar/` ซึ่งถูก ignore
- การตรวจเทียบใช้ dependency mocks ในหน่วยความจำ ไม่ได้เขียนข้อมูลลงฐานข้อมูลจริง และยังไม่ได้ทดสอบฟอร์มทุกหน้าผ่านเบราว์เซอร์

ไม่มีการ seed/migrate ฐานข้อมูล, commit หรือ push ในงานนี้
