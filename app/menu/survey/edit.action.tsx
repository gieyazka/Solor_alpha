// action.ts
import _ from "lodash";
import pMap from "p-map";
import {
  toId,
  sameId,
  extractFileId,
  usedFileIdSet,
  uploadFiles,
  step,
  processCrud,
} from "./fn";
import {
  createSurveyBuilding,
  createSurveyCabinet,
  createSurveySolarInstall,
  createSurveyTransformer,
  createSurveyUserBehavior,
  deleteSurveyBuilding,
  deleteSurveyCabinet,
  deleteSurveySolarInstall,
  deleteSurveyTransformer,
  deleteSurveyUserBehavior,
  updateSurvey,
  updateSurveyBuilding,
  updateSurveyCabinet,
  updateSurveySolarInstall,
  updateSurveyTransformer,
  updateSurveyUserBehavior,
} from "@/lib/survay.actions";
import { deleteImageSolar } from "@/lib/storage.action";
import { ID, Models } from "appwrite";
import {
  formatUserBehavior,
  formatTransformer,
  formatBuilding,
  formatCabinet,
  formatSolarCellInstall,
} from "./fn";
import { createClientAppwrite } from "@/utils/appwrite_client";
import { FormData } from "./page";
import { survey } from "@/@type";

// ====== สมมติฟังก์ชันของหนึ่ง (คงเดิม) ======
// formatUserBehavior, updateSurveyUserBehavior, createSurveyUserBehavior, deleteSurveyUserBehavior
// formatTransformer, updateSurveyTransformer, createSurveyTransformer, deleteSurveyTransformer
// formatBuilding, updateSurveyBuilding, createSurveyBuilding, deleteSurveyBuilding
// formatCabinet, updateSurveyCabinet, createSurveyCabinet, deleteSurveyCabinet
// formatSolarCellInstall, updateSurveySolarInstall, createSurveySolarInstall, deleteSurveySolarInstall
// deleteImageSolar, updateSurvey

export async function editSurvey(
  data: FormData,
  openDialog: {
    open: boolean;
    data?: (Models.Document & survey) | undefined;
  },
  setCurrentStep: (s: string) => void,
  setIsSubmitting: (b: boolean) => void
) {
  try {
    setIsSubmitting(true);
    const { storage } = await createClientAppwrite();
    const BUCKET = process.env.NEXT_PUBLIC_BUCKET_SOLAR!;

    // 1) พฤติกรรมผู้ใช้
    setCurrentStep("1/9: จัดข้อมูลพฤติกรรมผู้ใช้...");
    await step("1 section", async () => {
      await processCrud(
        "behavior",
        openDialog.data?.behavior,
        data.userBehavior,
        (o) => o.$id,
        (n) => n.docId,
        (rows) => formatUserBehavior(rows),
        async (payload) =>
          createSurveyUserBehavior({
            data: payload,
            surveyId: openDialog.data?.$id!,
          }),
        async (row) => {
          const [payload] = formatUserBehavior([row]);
          return updateSurveyUserBehavior({
            data: payload,
            behaviorId: row.docId!,
          });
        },
        async (o) => deleteSurveyUserBehavior({ docId: o.$id })
      );
    });

    // 2) หม้อแปลง (transformer)
    setCurrentStep("2/9: จัดข้อมูลหม้อแปลง...");
    await step("2 section", async () => {
      await processCrud(
        "transformer",
        openDialog.data?.transformer,
        data.transformer,
        (o) => o.$id,
        (n) => n.docId,
        (rows) => formatTransformer(rows.filter((r) => !r.docId)), // เฉพาะ add
        async (payload) =>
          createSurveyTransformer({
            surveyId: openDialog.data?.$id!,
            data: payload,
          }),
        async (row) => {
          const [payload] = formatTransformer([row]);
          return updateSurveyTransformer({
            data: payload,
            transformerId: row.docId!,
          });
        },
        async (o) => deleteSurveyTransformer({ transformerId: o.$id })
      );
    });

    // 3) อาคาร (building)
    setCurrentStep("3/9: จัดข้อมูลอาคาร...");
    await step("3 section", async () => {
      await processCrud(
        "building",
        openDialog.data?.building,
        data.building,
        (o) => o.$id,
        (n) => n.docId,
        (rows) => formatBuilding(rows.filter((r) => !r.docId)),
        async (payload) =>
          createSurveyBuilding({
            surveyId: openDialog.data?.$id!,
            data: payload,
          }),
        async (row) => {
          const [payload] = formatBuilding([row]);
          return updateSurveyBuilding({
            data: payload,
            buildingId: row.docId!,
          });
        },
        async (o) => deleteSurveyBuilding({ buildingId: o.$id })
      );
    });

    // 4) Zero Export Cabinet
    setCurrentStep("4/9: จัดข้อมูลตู้ไฟฟ้า Zero export...");
    await step("6.1 section", async () => {
      const oldZero = (openDialog.data?.cabinet ?? []).filter(
        (d: any) => d.type === "zeroExport"
      );
      const newZero = data.zeroExportCabinet ?? [];

      const { toAdd, toUpdate, toDelete } = _.cloneDeep(
        // re-use diff: old.$id vs new.docId
        (function diff() {
          const res = {
            toAdd: [] as any[],
            toUpdate: [] as any[],
            toDelete: [] as any[],
          };
          const d = new Set(
            newZero.map((n: any) => toId(n.docId)).filter(Boolean)
          );
          res.toDelete = oldZero.filter((o: any) => !d.has(toId(o.$id)));
          const oldIds = new Set(oldZero.map((o: any) => toId(o.$id)));
          res.toUpdate = newZero.filter(
            (n: any) =>
              n.docId &&
              oldIds.has(toId(n.docId)) &&
              !res.toDelete.some((o) => sameId(o.$id, n.docId))
          );
          res.toAdd = newZero.filter((n: any) => !n.docId);
          return res;
        })()
      );

      const formatAdd = await formatCabinet({
        zeroExportCabinet: toAdd,
        solarCellCabinet: [],
      });

      await Promise.all([
        pMap(
          toUpdate,
          async (row: any) => {
            const body: any = {
              cabinet: row.name,
              image: row.imageId ? [row.imageId] : [],
              type: "zeroExport",
            };
            if (row.photos) {
              const up = await storage.createFile(
                BUCKET,
                ID.unique(),
                row.photos as File
              );
              if (row.imageId) await deleteImageSolar(row.imageId);
              body.image = [up.$id];
            }
            return updateSurveyCabinet({ data: body, cabinetId: row.docId! });
          },
          { concurrency: 3 }
        ),
        pMap(
          formatAdd,
          (payload: any) =>
            createSurveyCabinet({
              surveyId: openDialog.data?.$id!,
              data: payload,
            }),
          { concurrency: 3 }
        ),
        pMap(
          toDelete,
          async (o: any) => {
            if (o.image?.[0]) await deleteImageSolar(o.image[0]);
            return deleteSurveyCabinet({ cabinetId: o.$id });
          },
          { concurrency: 3 }
        ),
      ]);
    });

    // 5) Solar Cell Cabinet
    setCurrentStep("5/9: จัดข้อมูลตู้ไฟฟ้าโซลาร์...");
    await step("6.2 section", async () => {
      const oldSolar = (openDialog.data?.cabinet ?? []).filter(
        (d: any) => d.type === "solarCell"
      );
      const newSolar = data.solarCellCabinet ?? [];

      const { toAdd, toUpdate, toDelete } = (function diff() {
        const res = {
          toAdd: [] as any[],
          toUpdate: [] as any[],
          toDelete: [] as any[],
        };
        const d = new Set(
          newSolar.map((n: any) => toId(n.docId)).filter(Boolean)
        );
        res.toDelete = oldSolar.filter((o: any) => !d.has(toId(o.$id)));
        const oldIds = new Set(oldSolar.map((o: any) => toId(o.$id)));
        res.toUpdate = newSolar.filter(
          (n: any) =>
            n.docId &&
            oldIds.has(toId(n.docId)) &&
            !res.toDelete.some((o) => sameId(o.$id, n.docId))
        );
        res.toAdd = newSolar.filter((n: any) => !n.docId);
        return res;
      })();

      const formatAdd = await formatCabinet({
        solarCellCabinet: toAdd,
        zeroExportCabinet: [],
      });

      await Promise.all([
        pMap(
          toUpdate,
          async (row: any) => {
            const body: any = {
              cabinet: row.name,
              image: row.imageId ? [row.imageId] : [],
              type: "solarCell",
            };
            if (row.photos) {
              const up = await storage.createFile(
                BUCKET,
                ID.unique(),
                row.photos as File
              );
              if (row.imageId) await deleteImageSolar(row.imageId);
              body.image = [up.$id];
            }
            return updateSurveyCabinet({ data: body, cabinetId: row.docId! });
          },
          { concurrency: 3 }
        ),
        pMap(
          formatAdd,
          (payload: any) =>
            createSurveyCabinet({
              surveyId: openDialog.data?.$id!,
              data: payload,
            }),
          { concurrency: 3 }
        ),
        pMap(
          toDelete,
          async (o: any) => {
            if (o.image?.[0]) await deleteImageSolar(o.image[0]);
            return deleteSurveyCabinet({ cabinetId: o.$id });
          },
          { concurrency: 3 }
        ),
      ]);
    });

    // 6) อาคารติดตั้งโซลาร์ (install_solar)
    setCurrentStep("6/9: จัดข้อมูลอาคารที่จะติดตั้งแผง...");
    await step("6.3 section", async () => {
      const oldArr = openDialog.data?.install_solar ?? [];
      const newArr = data.solarCellBuiling ?? [];

      const { toAdd, toUpdate, toDelete } = (function diff() {
        const res = {
          toAdd: [] as any[],
          toUpdate: [] as any[],
          toDelete: [] as any[],
        };
        const d = new Set(
          newArr.map((n: any) => toId(n.docId)).filter(Boolean)
        );
        res.toDelete = oldArr.filter((o: any) => !d.has(toId(o.$id)));
        const oldIds = new Set(oldArr.map((o: any) => toId(o.$id)));
        res.toUpdate = newArr.filter(
          (n: any) =>
            n.docId &&
            oldIds.has(toId(n.docId)) &&
            !res.toDelete.some((o) => sameId(o.$id, n.docId))
        );
        res.toAdd = newArr.filter((n: any) => !n.docId);
        return res;
      })();

      await Promise.all([
        // update
        pMap(
          toUpdate,
          async (row: any) => {
            const usedIds = usedFileIdSet(row.image); // จาก URL เป็น set ของ fileId
            const toDelete = (row.imageId ?? []).filter(
              (id: string) => !usedIds.has(toId(id))
            );
            // ลบรูปที่ไม่ใช้แล้ว
            await pMap(toDelete, (id: string) => deleteImageSolar(id), {
              concurrency: 3,
            });

            // อัปโหลดรูปใหม่ (ที่เป็น File)
            const newFiles = (row.photos ?? []).filter(
              (x: any) => x instanceof File
            );
            const uploadIds = newFiles.length
              ? await uploadFiles(storage, BUCKET, newFiles)
              : [];

            const body = {
              name: row.name,
              image: [...Array.from(usedIds), ...uploadIds],
            };
            return updateSurveySolarInstall({
              data: body,
              solarId: row.docId!,
            });
          },
          { concurrency: 3 }
        ),

        // create
        pMap(
          toAdd,
          async (row: any) => {
            const [payload] = await formatSolarCellInstall({
              solarCellBuiling: [row],
            });
            return createSurveySolarInstall({
              surveyId: openDialog.data?.$id!,
              data: payload,
            });
          },
          { concurrency: 3 }
        ),

        // delete
        pMap(
          toDelete,
          async (o: any) => {
            if (o.image)
              await pMap(o.image, (id: string) => deleteImageSolar(id), {
                concurrency: 3,
              });
            return deleteSurveySolarInstall({ solarId: o.$id });
          },
          { concurrency: 3 }
        ),
      ]);
    });

    // 7) Top view images
    setCurrentStep("7/9: จัดข้อมูลภาพมุมสูง...");
    const arrTopViewId = await step("6.4 section", async () => {
      const usedTop = usedFileIdSet(data.topviewImage); // จาก URL
      const toDelete = (openDialog.data?.topview_image ?? []).filter(
        (id: string) => !usedTop.has(toId(id))
      );
      const deleteIds = toDelete.map((s: string) => extractFileId(s));
      await pMap(deleteIds, (id) => deleteImageSolar(id), { concurrency: 3 });

      const newFiles = (data.topviewImage ?? []).filter(
        (x: any) => x instanceof File
      ) as File[];
      const uploaded = newFiles.length
        ? await uploadFiles(storage, BUCKET, newFiles)
        : [];
      return [...Array.from(usedTop), ...uploaded];
    });

    // 8) Bottom view images
    setCurrentStep("8/9: จัดข้อมูลภาพมุมต่ำ...");
    const arrBottomViewId = await step("6.5 section", async () => {
      const usedBottom = usedFileIdSet(data.bottomViewImage);
      const toDelete = (openDialog.data?.bottomview_image ?? []).filter(
        (id: string) => !usedBottom.has(toId(id))
      );
      const deleteIds = toDelete.map((s: string) => extractFileId(s));
      await pMap(deleteIds, (id) => deleteImageSolar(id), { concurrency: 3 });

      const newFiles = (data.bottomViewImage ?? []).filter(
        (x: any) => x instanceof File
      ) as File[];
      const uploaded = newFiles.length
        ? await uploadFiles(storage, BUCKET, newFiles)
        : [];
      return [...Array.from(usedBottom), ...uploaded];
    });

    // 9) อัปเดตเอกสารหลัก
    setCurrentStep("9/9: อัปเดตเอกสารสรุป...");
    const formatData = {
      school_name: data.schoolName,
      location: data.address,
      gps: data.gps,
      kwp: data.kwp,
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      surveyor: data.surveyor,
      grid_provider: data.gridProvider,
      roofplan: !!data.docsReceived?.roofplan,
      buildingplan: !!data.docsReceived?.buildingplan,
      elecplan: !!data.docsReceived?.elecplan,
      monthlybill: !!data.docsReceived?.monthlybill,
      loadprofile: !!data.docsReceived?.loadprofile,
      remark: data.remark,
      voltageLevel: data.voltageLevel,
      transformerCount: data.transformerCount,
      topview_image: arrTopViewId,
      bottomview_image: arrBottomViewId,
    };

    await updateSurvey({ data: formatData, docId: openDialog.data!.$id });
  } finally {
    setIsSubmitting(false);
    setCurrentStep("");
  }
}
